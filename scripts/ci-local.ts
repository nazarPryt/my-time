import { resolve } from 'node:path'
import { createConfig, parseArgs, USAGE } from './ci-local/config'
import { runLocalCi } from './ci-local/run-local-ci'

const options = parseArgs(process.argv.slice(2), Boolean(process.stdout.isTTY))
if (!options) {
	console.error(USAGE)
	process.exit(1)
}

const config = createConfig(resolve(import.meta.dir, '..'), options)
process.exit(await runLocalCi(config))
