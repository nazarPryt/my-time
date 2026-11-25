import path from 'node:path'
import chokidar from 'chokidar'
import { listIgnored, parse } from './parser'
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

const CLIENT_DIR = path.join(import.meta.dir, 'client')
const STATIC_FILES: Record<string, string> = {
	'/': 'index.html',
	'/app.js': 'app.js',
	'/styles.css': 'styles.css',
}

function startServer(port: number): ReturnType<typeof Bun.serve> {
	try {
		const server = Bun.serve({
			port,
			fetch(req, server) {
				const { pathname } = new URL(req.url)
				if (pathname === '/ws') {
					return server.upgrade(req)
						? undefined
						: new Response('Upgrade failed', { status: 400 })
				}
				const file = STATIC_FILES[pathname]
				if (!file) return new Response('Not found', { status: 404 })
				// Read on every request so UI edits show up on a browser refresh.
				return new Response(Bun.file(path.join(CLIENT_DIR, file)))
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

// Same rule as the parser: watch everything .gitignore does not exclude.
let ignored = listIgnored(ROOT)
const onChange = (filePath: string) => {
	if (filePath.endsWith('.gitignore')) ignored = listIgnored(ROOT)
	debouncedReparse()
}

chokidar
	.watch('.', {
		cwd: ROOT,
		ignored: (filePath: string) => {
			const rel = path.relative(ROOT, filePath)
			if (rel === '.git' || rel.startsWith('.git/')) return true
			return ignored.some((ig) =>
				ig.endsWith('/') ? `${rel}/`.startsWith(ig) : rel === ig,
			)
		},
		ignoreInitial: true,
	})
	.on('change', onChange)
	.on('add', onChange)
	.on('unlink', onChange)
	.on('unlinkDir', onChange)
	.on('error', (err: unknown) =>
		console.warn('[graph] watcher error:', (err as Error).message),
	)

console.log('[graph] watching for changes...')
