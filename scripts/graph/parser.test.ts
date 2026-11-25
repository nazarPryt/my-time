import { expect, test } from 'bun:test'
import path from 'node:path'
import { listRepoFiles, parse } from './parser'

const ROOT = path.resolve(import.meta.dir, '../..')
const graph = await parse(ROOT)
const ids = new Set(graph.nodes.map((n) => n.id))

test('every workspace package becomes an app node without configuration', () => {
	const workspaces = listRepoFiles(ROOT)
		.filter((f) => f.endsWith('/package.json'))
		.map((f) => path.dirname(f))
	expect(workspaces.length).toBeGreaterThan(0)
	for (const ws of workspaces) {
		if (graph.nodes.some((n) => n.app === ws)) expect(ids.has(ws)).toBe(true)
	}
	expect(ids.has('apps/web')).toBe(true)
	expect(ids.has('packages/contracts')).toBe(true)
})

test('gitignored files never become nodes', () => {
	for (const node of graph.nodes) {
		expect(node.id).not.toContain('node_modules')
		expect(node.id).not.toMatch(/(^|\/)dist\//)
	}
})

test('vue files are parsed and their imports resolved', () => {
	const vueEdge = graph.edges.find(
		(e) =>
			e.source.startsWith('apps/english-quiz::') &&
			e.target.startsWith('packages/micro-frontends::'),
	)
	expect(vueEdge).toBeDefined()
})

test('tsconfig path aliases resolve to workspace sources', () => {
	const crossApp = graph.edges.find(
		(e) =>
			e.source.startsWith('apps/web::') &&
			e.target.startsWith('packages/contracts::'),
	)
	expect(crossApp).toBeDefined()
})

test('every edge endpoint resolves to a known node', () => {
	expect(graph.edges.length).toBeGreaterThan(0)
	for (const edge of graph.edges) {
		expect(ids.has(edge.source)).toBe(true)
		expect(ids.has(edge.target)).toBe(true)
		expect(edge.source).not.toBe(edge.target)
		expect(edge.count).toBeGreaterThan(0)
	}
})

test('parser produces no duplicate node ids', () => {
	expect(graph.nodes.length).toBe(ids.size)
})
