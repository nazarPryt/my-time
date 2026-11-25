import { readdirSync, readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'

// Validates the observability and nginx configs with the same images that run
// them in production (docs/observability.md). Needs a running Docker daemon.
const root = resolve(import.meta.dir, '..')
const obs = join(root, 'observability')
const provisioning = join(obs, 'grafana/provisioning')

// The last FROM is the image that runs the config (multi-stage builds included).
function runtimeImage(dockerfile: string) {
	const images = [
		...readFileSync(join(root, dockerfile), 'utf8').matchAll(/^FROM\s+(\S+)/gm),
	]
	const image = images.at(-1)?.[1]
	if (!image) throw new Error(`No FROM line in ${dockerfile}`)
	return image
}

type AlertRule = {
	uid: string
	title: string
	data: { datasourceUid: string; model: { expr?: string } }[]
}
type RulesFile = { groups: { name: string; rules: AlertRule[] }[] }

const DATASOURCE_UIDS = new Set(['prometheus', 'loki', '__expr__'])

function readRules(): RulesFile {
	return Bun.YAML.parse(
		readFileSync(join(provisioning, 'alerting/rules.yaml'), 'utf8'),
	) as RulesFile
}

// Prometheus rule file holding every PromQL alert query, so promtool parses them.
function promqlRuleFile(rules: RulesFile) {
	const lines = ['groups:', '  - name: grafana-alert-queries', '    rules:']
	for (const group of rules.groups) {
		for (const rule of group.rules) {
			for (const query of rule.data) {
				if (query.datasourceUid !== 'prometheus' || !query.model.expr) continue
				lines.push(
					`      - alert: ${JSON.stringify(rule.uid)}`,
					`        expr: ${JSON.stringify(query.model.expr)}`,
				)
			}
		}
	}
	return `${lines.join('\n')}\n`
}

function checkProvisioningFiles(rules: RulesFile) {
	for (const folder of readdirSync(provisioning)) {
		for (const file of readdirSync(join(provisioning, folder))) {
			const text = readFileSync(join(provisioning, folder, file), 'utf8')
			if (file.endsWith('.yaml')) Bun.YAML.parse(text)
			if (file.endsWith('.json')) JSON.parse(text)
		}
	}
	const uids = new Set<string>()
	for (const group of rules.groups) {
		for (const rule of group.rules) {
			if (uids.has(rule.uid)) throw new Error(`Duplicate rule uid ${rule.uid}`)
			uids.add(rule.uid)
			for (const query of rule.data) {
				if (!DATASOURCE_UIDS.has(query.datasourceUid)) {
					throw new Error(
						`${rule.uid}: unknown datasource uid ${query.datasourceUid}`,
					)
				}
			}
		}
	}
	console.info(`Grafana provisioning parsed (${uids.size} alert rules)`)
}

const rules = readRules()
const prometheusImage = runtimeImage('observability/prometheus.Dockerfile')
const checks: { name: string; command: string[]; stdin?: string }[] = [
	{
		name: 'alloy',
		command: [
			'docker',
			'run',
			'--rm',
			'-v',
			`${obs}/config.alloy:/etc/alloy/config.alloy:ro`,
			runtimeImage('observability/alloy.Dockerfile'),
			'validate',
			'/etc/alloy/config.alloy',
		],
	},
	{
		name: 'loki',
		command: [
			'docker',
			'run',
			'--rm',
			'-v',
			`${obs}/loki-config.yaml:/etc/loki/local-config.yaml:ro`,
			runtimeImage('observability/loki.Dockerfile'),
			'-config.file=/etc/loki/local-config.yaml',
			'-verify-config',
		],
	},
	{
		name: 'prometheus',
		command: [
			'docker',
			'run',
			'--rm',
			'--entrypoint',
			'promtool',
			'-v',
			`${obs}/prometheus.yml:/etc/prometheus/prometheus.yml:ro`,
			prometheusImage,
			'check',
			'config',
			'/etc/prometheus/prometheus.yml',
		],
	},
	{
		name: 'alert PromQL',
		command: [
			'docker',
			'run',
			'--rm',
			'-i',
			'--entrypoint',
			'promtool',
			prometheusImage,
			'check',
			'rules',
		],
		stdin: promqlRuleFile(rules),
	},
	...['web', 'english-quiz'].map((app) => ({
		name: `nginx (${app})`,
		command: [
			'docker',
			'run',
			'--rm',
			'-v',
			`${root}/apps/${app}/nginx.conf:/etc/nginx/conf.d/default.conf:ro`,
			runtimeImage(`apps/${app}/Dockerfile`),
			'nginx',
			'-t',
		],
	})),
]

let failed = false
try {
	checkProvisioningFiles(rules)
} catch (error) {
	console.error(error instanceof Error ? error.message : error)
	failed = true
}
for (const check of checks) {
	console.info(`\n> ${check.name}`)
	const proc = Bun.spawn(check.command, {
		stdin: check.stdin ? new Blob([check.stdin]) : 'ignore',
		stdout: 'inherit',
		stderr: 'inherit',
	})
	if ((await proc.exited) !== 0) {
		console.error(`Failed: ${check.name}`)
		failed = true
	}
}
if (failed) process.exit(1)
console.info('\nObservability configs are valid.')
