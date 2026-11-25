import { GRAFANA_ADMIN, GRAFANA_URL } from '../config'
import type { Panel, Target } from './dashboards'

// Talks to Grafana's HTTP API, so queries run exactly as the dashboards run them.
const AUTH = `Basic ${btoa(`${GRAFANA_ADMIN.user}:${GRAFANA_ADMIN.password}`)}`

// Values the logs-explorer variables have when the dashboard opens.
const VARIABLE_DEFAULTS: Record<string, string> = {
	$service: '.+',
	$level: '.*',
	'${search:regex}': '',
	$requestId: '',
}

type Frame = {
	schema: { fields: { name: string; labels?: Record<string, string> }[] }
	data?: { values: unknown[][] }
}

/** One returned series: its labels and numeric values (empty for log lines). */
export type Series = {
	labels: Record<string, string>
	values: number[]
	rows: number
}

export type QueryResult = { error?: string; series: Series[] }

/** Runs a panel query through Grafana's API, as the dashboard would. */
export async function queryPanel(
	panel: Panel,
	target: Target,
	range: { from: string; to: string },
): Promise<QueryResult> {
	let expr = target.expr ?? ''
	for (const [name, value] of Object.entries(VARIABLE_DEFAULTS))
		expr = expr.replaceAll(name, value)
	const datasource = target.datasource?.uid ?? panel.datasource?.uid
	const query = {
		...target,
		expr,
		refId: 'A',
		datasource: { uid: datasource },
		maxDataPoints: 500,
		...(panel.interval ? { interval: panel.interval } : {}),
		...(datasource === 'loki' && !target.queryType
			? { queryType: 'range' }
			: {}),
	}
	const response = await fetch(`${GRAFANA_URL}/api/ds/query`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json', Authorization: AUTH },
		body: JSON.stringify({ ...range, queries: [query] }),
	})
	const body = (await response.json()) as {
		message?: string
		results?: { A?: { error?: string; frames?: Frame[] } }
	}
	const result = body.results?.A
	if (!response.ok || result?.error)
		return {
			error: result?.error ?? body.message ?? `HTTP ${response.status}`,
			series: [],
		}
	const series: Series[] = []
	for (const frame of result?.frames ?? []) {
		const columns = frame.data?.values ?? []
		const rows = columns[0]?.length ?? 0
		if (rows === 0) continue
		const valueField = frame.schema.fields.at(-1)
		const last = columns.at(-1) ?? []
		series.push({
			labels: valueField?.labels ?? {},
			values: last.filter((v): v is number => typeof v === 'number'),
			rows,
		})
	}
	return { series }
}

/** Instant PromQL value straight from Prometheus (through Grafana's proxy). */
export async function promValue(expr: string): Promise<number | undefined> {
	const url = `${GRAFANA_URL}/api/datasources/proxy/uid/prometheus/api/v1/query?query=${encodeURIComponent(expr)}`
	const response = await fetch(url, { headers: { Authorization: AUTH } })
	if (!response.ok) return undefined
	const body = (await response.json()) as {
		data?: { result?: { value: [number, string] }[] }
	}
	const value = body.data?.result?.[0]?.value[1]
	return value === undefined ? undefined : Number(value)
}
