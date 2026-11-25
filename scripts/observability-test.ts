import { resolve } from 'node:path'
import { createConfig, parseArgs, USAGE } from './observability-test/config'
import { runObservabilityTest } from './observability-test/run-observability-test'

// End-to-end check of the Grafana dashboards (docs/observability.md): starts
// the observability stack with a disposable API + Postgres, sends known
// traffic, then asserts every panel shows exactly that.
const options = parseArgs(process.argv.slice(2), Boolean(process.stdout.isTTY))
if (!options) {
	console.error(USAGE)
	process.exit(2)
}
const root = resolve(import.meta.dir, '..')
process.exit(await runObservabilityTest(createConfig(root, options)))
