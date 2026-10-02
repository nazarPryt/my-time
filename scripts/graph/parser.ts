import path from 'node:path'
import { Project } from 'ts-morph'
import { chainForFile } from './grouping'
import type { GraphData, GraphEdge, GraphNode } from './types'

interface AppConfig {
	tsconfig: string
}

function getAppConfigs(root: string): AppConfig[] {
	return [
		{ tsconfig: path.join(root, 'apps/web/tsconfig.app.json') },
		{ tsconfig: path.join(root, 'apps/api/tsconfig.json') },
		{ tsconfig: path.join(root, 'apps/extension/tsconfig.json') },
		{ tsconfig: path.join(root, 'apps/mobile/tsconfig.json') },
		{ tsconfig: path.join(root, 'contracts/tsconfig.json') },
		{ tsconfig: path.join(root, 'packages/features/tsconfig.json') },
	]
}

export async function parse(root: string): Promise<GraphData> {
	const nodeMap = new Map<string, GraphNode>()
	// Edges are aggregated at the file level; `count` tracks how many distinct
	// file-import pairs collapse into one file→file edge.
	const edgeMap = new Map<string, GraphEdge>()

	function addNode(node: GraphNode) {
		if (!nodeMap.has(node.id)) nodeMap.set(node.id, node)
	}

	function addEdge(source: string, target: string) {
		if (source === target) return
		const key = `${source}→${target}`
		const existing = edgeMap.get(key)
		if (existing) {
			existing.count += 1
		} else {
			edgeMap.set(key, { source, target, count: 1 })
		}
	}

	for (const config of getAppConfigs(root)) {
		let project: Project
		try {
			project = new Project({
				tsConfigFilePath: config.tsconfig,
				skipAddingFilesFromTsConfig: false,
				skipFileDependencyResolution: false,
			})
		} catch {
			console.warn(`[graph] Skipping ${config.tsconfig} (not found or invalid)`)
			continue
		}

		for (const sourceFile of project.getSourceFiles()) {
			const src = chainForFile(sourceFile.getFilePath(), root)
			if (!src) continue

			addNode(src.app)
			addNode(src.feature)
			addNode(src.file)

			for (const importDecl of sourceFile.getImportDeclarations()) {
				const resolved = importDecl.getModuleSpecifierSourceFile()
				if (!resolved) continue

				const tgt = chainForFile(resolved.getFilePath(), root)
				if (!tgt) continue

				addNode(tgt.app)
				addNode(tgt.feature)
				addNode(tgt.file)

				addEdge(src.file.id, tgt.file.id)
			}
		}
	}

	return {
		nodes: Array.from(nodeMap.values()),
		edges: Array.from(edgeMap.values()),
	}
}
