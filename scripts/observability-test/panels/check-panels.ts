import { type QueryResult, queryPanel } from '../grafana/client'
import { type Dashboard, type Panel, panelsOf } from '../grafana/dashboards'
import type { Counts } from '../traffic/traffic'
import { compare, reduce } from './compare'
import { ALLOWED_EMPTY, EXPECTATIONS } from './expectations'

const RANGE = { from: 'now-1h', to: 'now' }

async function queryAll(panel: Panel): Promise<QueryResult[]> {
	return Promise.all(
		(panel.targets ?? []).map((target) => queryPanel(panel, target, RANGE)),
	)
}

/** Returns one line per problem; empty when every panel is right. */
export async function checkPanels(
	dashboards: Dashboard[],
	counts: Counts,
): Promise<string[]> {
	const problems: string[] = []
	for (const dashboard of dashboards) {
		const allowedEmpty = ALLOWED_EMPTY[dashboard.uid] ?? []
		for (const panel of panelsOf(dashboard)) {
			const name = `${dashboard.title} › ${panel.title}`
			const results = await queryAll(panel)
			const errors = results.flatMap((r) => (r.error ? [r.error] : []))
			if (errors.length) {
				problems.push(`${name}: query error: ${errors.join('; ')}`)
				continue
			}
			const hasData = results.some((r) => r.series.length > 0)
			if (!hasData && !allowedEmpty.includes(panel.title))
				problems.push(`${name}: no data`)

			const expectation = EXPECTATIONS.find(
				(e) => e.dashboard === dashboard.uid && e.panel === panel.title,
			)
			if (!expectation) continue
			const mismatch = compare(
				reduce(results, expectation.reduce),
				expectation.expected(counts),
			)
			if (mismatch) problems.push(`${name}: ${mismatch}`)
		}
	}

	for (const e of EXPECTATIONS) {
		const exists = dashboards.some(
			(d) =>
				d.uid === e.dashboard && panelsOf(d).some((p) => p.title === e.panel),
		)
		if (!exists)
			problems.push(`${e.dashboard} › ${e.panel}: panel not found (renamed?)`)
	}
	return problems
}
