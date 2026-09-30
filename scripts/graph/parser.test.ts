import { expect, test } from 'bun:test'
import path from 'node:path'
import { parse } from './parser'

const ROOT = path.resolve(import.meta.dir, '../..')
const graph = await parse(ROOT)

test('parser emits app-level nodes', () => {
	const web = graph.nodes.find((n) => n.id === 'web')
	expect(web).toBeDefined()
	expect(web?.type).toBe('app')
	expect(web?.app).toBe('web')
})

test('parser finds web/auth feature node parented to the web app', () => {
	const node = graph.nodes.find((n) => n.id === 'web/auth')
	expect(node).toBeDefined()
	expect(node?.type).toBe('feature')
	expect(node?.parent).toBe('web')
})

test('parser finds api/auth feature node', () => {
	const node = graph.nodes.find((n) => n.id === 'api/auth')
	expect(node).toBeDefined()
	expect(node?.app).toBe('api')
})

test('parser finds contracts/auth feature node', () => {
	const node = graph.nodes.find((n) => n.id === 'contracts/auth')
	expect(node).toBeDefined()
	expect(node?.type).toBe('feature')
	expect(node?.app).toBe('contracts')
})

test('parser emits file-level nodes for web features', () => {
	const fileNode = graph.nodes.find(
		(n) => n.type === 'file' && n.parent === 'web/auth',
	)
	expect(fileNode).toBeDefined()
	expect(fileNode?.id).toMatch(/^web\/auth\//)
	expect(fileNode?.label).toBeTruthy()
})

test('every edge endpoint resolves to a known node', () => {
	expect(graph.edges.length).toBeGreaterThan(0)
	const ids = new Set(graph.nodes.map((n) => n.id))
	for (const edge of graph.edges) {
		expect(ids.has(edge.source)).toBe(true)
		expect(ids.has(edge.target)).toBe(true)
	}
})

test('edges carry a positive import count', () => {
	for (const edge of graph.edges) {
		expect(edge.count).toBeGreaterThan(0)
	}
})

test('parser produces no duplicate node ids', () => {
	const ids = graph.nodes.map((n) => n.id)
	expect(ids.length).toBe(new Set(ids).size)
})

test('parser produces no self-loop edges', () => {
	for (const edge of graph.edges) {
		expect(edge.source).not.toBe(edge.target)
	}
})

test('parser emits at least one cross-app edge (web → contracts)', () => {
	const crossAppEdge = graph.edges.find(
		(e) => e.source.startsWith('web/') && e.target.startsWith('contracts/'),
	)
	expect(crossAppEdge).toBeDefined()
})
