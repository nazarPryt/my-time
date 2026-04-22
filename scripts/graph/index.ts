import path from 'node:path'
import chokidar from 'chokidar'
import { parse } from './parser'
import { getHtml } from './template'
import type { GraphData } from './types'

const ROOT = path.resolve(import.meta.dir, '../..')

const clients = new Set<{ send(data: string): void }>()
let currentGraph: GraphData = { nodes: [], edges: [] }

function broadcast(graph: GraphData) {
	currentGraph = graph
	const msg = JSON.stringify({ type: 'graph', data: graph })
	for (const client of clients) {
		try {
			client.send(msg)
		} catch {
			clients.delete(client)
		}
	}
}

async function reparse() {
	console.log('[graph] parsing...')
	const graph = await parse(ROOT)
	console.log(
		`[graph] ${graph.nodes.length} nodes, ${graph.edges.length} edges`,
	)
	broadcast(graph)
}

function debounce<T extends () => void>(fn: T, ms: number): T {
	let timer: ReturnType<typeof setTimeout>
	return (() => {
		clearTimeout(timer)
		timer = setTimeout(fn, ms)
	}) as T
}

const debouncedReparse = debounce(reparse, 300)

function startServer(port: number): ReturnType<typeof Bun.serve> {
	let html = ''
	try {
		const server = Bun.serve({
			port,
			fetch(req, server) {
				if (server.upgrade(req)) return
				if (!html) html = getHtml(server.port)
				return new Response(html, {
					headers: { 'Content-Type': 'text/html; charset=utf-8' },
				})
			},
			websocket: {
				open(ws) {
					clients.add(ws)
					ws.send(JSON.stringify({ type: 'graph', data: currentGraph }))
				},
				close(ws) {
					clients.delete(ws)
				},
				message() {},
			},
		})
		return server
	} catch (e: unknown) {
		if (
			e instanceof Error &&
			'code' in e &&
			(e as NodeJS.ErrnoException).code === 'EADDRINUSE' &&
			port < 4300
		) {
			return startServer(port + 1)
		}
		throw e
	}
}

const server = startServer(4242)
console.log(`[graph] listening on http://localhost:${server.port}`)

const openCmd = process.platform === 'darwin' ? 'open' : 'xdg-open'
Bun.spawn([openCmd, `http://localhost:${server.port}`], {
	stderr: 'ignore',
	stdout: 'ignore',
})

await reparse()

chokidar
	.watch(['apps', 'contracts', 'packages'], {
		cwd: ROOT,
		ignored: ['**/node_modules/**', '**/.git/**', '**/dist/**', '**/.wxt/**'],
		ignoreInitial: true,
	})
	.on('change', debouncedReparse)
	.on('add', debouncedReparse)
	.on('unlink', debouncedReparse)

console.log('[graph] watching for changes...')
