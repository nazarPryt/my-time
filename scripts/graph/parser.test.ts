import { expect, test } from 'bun:test'
import path from 'node:path'
import { parse } from './parser'

const ROOT = path.resolve(import.meta.dir, '../..')

test('parser finds web/auth feature node', async () => {
	const graph = await parse(ROOT)
	const node = graph.nodes.find((n) => n.id === 'web/auth')
	expect(node).toBeDefined()
	expect(node?.type).toBe('feature')
	expect(node?.app).toBe('web')
})

test('parser finds api/auth feature node', async () => {
	const graph = await parse(ROOT)
	const node = graph.nodes.find((n) => n.id === 'api/auth')
	expect(node).toBeDefined()
	expect(node?.app).toBe('api')
})

test('parser finds contracts/auth package node', async () => {
	const graph = await parse(ROOT)
	const node = graph.nodes.find((n) => n.id === 'contracts/auth')
	expect(node).toBeDefined()
	expect(node?.type).toBe('package')
	expect(node?.app).toBeNull()
})

test('parser emits file-level nodes for web features', async () => {
	const graph = await parse(ROOT)
	const fileNode = graph.nodes.find(
		(n) => n.type === 'file' && n.parent === 'web/auth',
	)
	expect(fileNode).toBeDefined()
	expect(fileNode?.label).toBeTruthy()
})

test('parser emits edges between features', async () => {
	const graph = await parse(ROOT)
	expect(graph.edges.length).toBeGreaterThan(0)
	const ids = new Set(graph.nodes.map((n) => n.id))
	for (const edge of graph.edges) {
		expect(ids.has(edge.source)).toBe(true)
		expect(ids.has(edge.target)).toBe(true)
	}
})

test('parser produces no duplicate node ids', async () => {
	const graph = await parse(ROOT)
	const ids = graph.nodes.map((n) => n.id)
	const unique = new Set(ids)
	expect(ids.length).toBe(unique.size)
})

test('parser produces no self-loop edges', async () => {
	const graph = await parse(ROOT)
	for (const edge of graph.edges) {
		expect(edge.source).not.toBe(edge.target)
	}
})
