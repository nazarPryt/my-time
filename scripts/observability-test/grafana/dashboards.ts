import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const DASHBOARDS_DIR = join(
	import.meta.dir,
	'../../../observability/grafana/provisioning/dashboards',
)

export type Target = {
	expr?: string
	datasource?: { uid?: string }
	[key: string]: unknown
}

export type Panel = {
	id: number
	type: string
	title: string
	interval?: string
	datasource?: { uid?: string }
	targets?: Target[]
	panels?: Panel[]
}

export type Dashboard = { uid: string; title: string; panels: Panel[] }

/** The provisioned dashboards, read from the repo (what Grafana loads). */
export function loadDashboards(): Dashboard[] {
	return readdirSync(DASHBOARDS_DIR)
		.filter((file) => file.endsWith('.json'))
		.map((file) => JSON.parse(readFileSync(join(DASHBOARDS_DIR, file), 'utf8')))
}

/** Every panel that runs a query, including those inside collapsed rows. */
export function panelsOf(dashboard: Dashboard): Panel[] {
	const flat = (panels: Panel[]): Panel[] =>
		panels.flatMap((panel) => [panel, ...flat(panel.panels ?? [])])
	return flat(dashboard.panels).filter((panel) => panel.targets?.length)
}

export function countPanels(dashboards: Dashboard[]): number {
	return dashboards.reduce((n, d) => n + panelsOf(d).length, 0)
}
