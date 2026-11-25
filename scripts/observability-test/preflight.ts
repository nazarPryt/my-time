import {
	checkDocker,
	checkPlaywrightChromium,
	checkPorts,
	type PreflightFailure,
} from '../shared/step-runner'
import { API_PORT, COMPOSE_PROJECT, GRAFANA_PORT } from './config'

// The shared step-runner checks, for what this test needs; all run in about a second.
export async function runPreflight(root: string): Promise<PreflightFailure[]> {
	const ports = await checkPorts([
		{ port: API_PORT, use: 'test API' },
		{ port: GRAFANA_PORT, use: 'test Grafana' },
	])
	const leftover = ports.length
		? [
				{
					problem: 'A stack left by --keep may still be running',
					fix: `docker compose -p ${COMPOSE_PROJECT} down -v`,
				},
			]
		: []
	const results = await Promise.all([
		checkDocker(root),
		checkPlaywrightChromium(root),
	])
	return [...results.flat(), ...ports, ...leftover]
}
