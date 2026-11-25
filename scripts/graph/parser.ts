import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { ts } from 'ts-morph'
import { chainForFile } from './grouping'
import type { GraphData, GraphEdge, GraphNode } from './types'

const SOURCE_RE = /\.(ts|tsx|mts|cts|js|jsx|mjs|cjs|vue)$/
const DEFAULT_OPTIONS: ts.CompilerOptions = {
	module: ts.ModuleKind.ESNext,
	moduleResolution: ts.ModuleResolutionKind.Bundler,
	allowJs: true,
	jsx: ts.JsxEmit.Preserve,
}

function git(root: string, args: string[]): string[] {
	const out = Bun.spawnSync(['git', ...args, '-z'], { cwd: root })
	if (out.exitCode !== 0) throw new Error(out.stderr.toString())
	return out.stdout.toString().split('\0').filter(Boolean)
}

// Every tracked or new file that .gitignore does not exclude.
export function listRepoFiles(root: string): string[] {
	return git(root, ['ls-files', '--cached', '--others', '--exclude-standard'])
		.filter((rel) => existsSync(path.join(root, rel)))
		.sort()
}

// Ignored paths (directories end with "/"), for the file watcher.
export function listIgnored(root: string): string[] {
	return git(root, [
		'ls-files',
		'--others',
		'--ignored',
		'--exclude-standard',
		'--directory',
	])
}

function scriptOf(abs: string): string {
	const text = readFileSync(abs, 'utf8')
	if (!abs.endsWith('.vue')) return text
	const blocks = text.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)
	return Array.from(blocks, (m) => m[1]).join('\n')
}

interface Config {
	options: ts.CompilerOptions
	dir: string
	fileNames: Set<string>
	cache: ts.ModuleResolutionCache
}

function createConfigLookup(root: string, files: string[]) {
	const host: ts.ParseConfigFileHost = {
		...ts.sys,
		onUnRecoverableConfigFileDiagnostic: () => {},
	}
	const byDir = new Map<string, Config[]>()
	for (const rel of files) {
		if (!/(^|\/)tsconfig[^/]*\.json$/.test(rel)) continue
		const abs = path.join(root, rel)
		const parsed = ts.getParsedCommandLineOfConfigFile(abs, {}, host)
		if (!parsed) continue
		const dir = path.dirname(abs)
		const options = { ...DEFAULT_OPTIONS, ...parsed.options }
		const config: Config = {
			options,
			dir,
			fileNames: new Set(parsed.fileNames.map((f) => path.resolve(f))),
			cache: ts.createModuleResolutionCache(dir, (f) => f, options),
		}
		byDir.set(dir, [...(byDir.get(dir) ?? []), config])
	}

	const fallback: Config = {
		options: DEFAULT_OPTIONS,
		dir: root,
		fileNames: new Set(),
		cache: ts.createModuleResolutionCache(root, (f) => f, DEFAULT_OPTIONS),
	}

	// Nearest folder with a tsconfig; prefer the config that includes the file
	// (e.g. tsconfig.app.json over a references-only tsconfig.json).
	return (abs: string): Config => {
		for (let dir = path.dirname(abs); ; dir = path.dirname(dir)) {
			const configs = byDir.get(dir)
			if (configs) {
				return (
					configs.find((c) => c.fileNames.has(abs)) ??
					configs.find((c) => c.options.paths) ??
					configs[0]
				)
			}
			if (dir === root || dir === path.dirname(dir)) return fallback
		}
	}
}

// TypeScript can't resolve .vue imports, so map them by path (and `paths`).
function resolveVue(spec: string, from: string, config: Config): string[] {
	if (spec.startsWith('.')) return [path.resolve(path.dirname(from), spec)]
	const base =
		config.options.baseUrl ??
		(config.options.pathsBasePath as string | undefined) ??
		config.dir
	const out: string[] = []
	for (const [pattern, targets] of Object.entries(config.options.paths ?? {})) {
		const [prefix, suffix = ''] = pattern.split('*')
		if (!spec.startsWith(prefix) || !spec.endsWith(suffix)) continue
		const star = spec.slice(prefix.length, spec.length - suffix.length)
		for (const t of targets) out.push(path.resolve(base, t.replace('*', star)))
	}
	return out
}

export async function parse(root: string): Promise<GraphData> {
	const files = listRepoFiles(root)
	const sources = files.filter((f) => SOURCE_RE.test(f) && !f.endsWith('.d.ts'))
	const sourceSet = new Set(sources)
	const workspaces = files
		.filter((f) => f.endsWith('/package.json'))
		.map((f) => path.dirname(f))
	const configFor = createConfigLookup(root, files)

	const nodeMap = new Map<string, GraphNode>()
	// Edges are aggregated at the file level; `count` tracks how many import
	// statements collapse into one file→file edge.
	const edgeMap = new Map<string, GraphEdge>()

	function addChain(rel: string): string {
		const chain = chainForFile(rel, workspaces)
		for (const node of [chain.app, chain.feature, chain.file]) {
			if (!nodeMap.has(node.id)) nodeMap.set(node.id, node)
		}
		return chain.file.id
	}

	function resolve(spec: string, from: string, config: Config): string | null {
		const candidates = spec.endsWith('.vue')
			? resolveVue(spec, from, config)
			: [
					ts.resolveModuleName(spec, from, config.options, ts.sys, config.cache)
						.resolvedModule?.resolvedFileName,
				]
		for (const abs of candidates) {
			if (!abs) continue
			const real = existsSync(abs) ? (ts.sys.realpath?.(abs) ?? abs) : abs
			const rel = path.relative(root, real)
			if (sourceSet.has(rel)) return rel
		}
		return null
	}

	for (const rel of sources) {
		const abs = path.join(root, rel)
		const src = addChain(rel)
		const config = configFor(abs)
		const { importedFiles } = ts.preProcessFile(scriptOf(abs), true, true)

		for (const { fileName } of importedFiles) {
			const target = resolve(fileName, abs, config)
			if (!target) continue
			const tgt = addChain(target)
			if (tgt === src) continue
			const key = `${src}→${tgt}`
			const existing = edgeMap.get(key)
			if (existing) existing.count += 1
			else edgeMap.set(key, { source: src, target: tgt, count: 1 })
		}
	}

	return {
		nodes: Array.from(nodeMap.values()),
		edges: Array.from(edgeMap.values()),
	}
}
