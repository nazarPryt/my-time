import path from 'node:path'
import { Project } from 'ts-morph'
import { fileNodeForFile, nodeForFile } from './grouping'
import type { GraphData, GraphEdge, GraphNode } from './types'

interface AppConfig {
	tsconfig: string
}

function getAppConfigs(root: string): AppConfig[] {
	return [
		{ tsconfig: path.join(root, 'apps/web/tsconfig.app.json') },
		{ tsconfig: path.join(root, 'apps/api/tsconfig.json') },
		{ tsconfig: path.join(root, 'apps/extension/tsconfig.json') },
		{ tsconfig: path.join(root, 'contracts/tsconfig.json') },
		{ tsconfig: path.join(root, 'packages/features/tsconfig.json') },
	]
}

export async function parse(root: string): Promise<GraphData> {
	const nodeMap = new Map<string, GraphNode>()
	const edgeSet = new Set<string>()
	const edges: GraphEdge[] = []

	function addNode(node: GraphNode) {
		if (!nodeMap.has(node.id)) nodeMap.set(node.id, node)
	}

	function addEdge(source: string, target: string) {
		if (source === target) return
		const key = `${source}→${target}`
		if (!edgeSet.has(key)) {
			edgeSet.add(key)
			edges.push({ source, target })
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
			const filePath = sourceFile.getFilePath()

			const ownerNode = nodeForFile(filePath, root)
			if (!ownerNode) continue
			addNode(ownerNode)

			const fNode = fileNodeForFile(filePath, root)
			if (fNode) addNode(fNode)

			for (const importDecl of sourceFile.getImportDeclarations()) {
				const resolved = importDecl.getModuleSpecifierSourceFile()
				if (!resolved) continue

				const targetPath = resolved.getFilePath()
				const targetNode = nodeForFile(targetPath, root)
				if (!targetNode) continue

				addNode(targetNode)

				// File-level edge
				const srcFileNode = fNode ?? ownerNode
				const tgtFileNode = fileNodeForFile(targetPath, root)
				if (tgtFileNode) {
					addNode(tgtFileNode)
					addEdge(srcFileNode.id, tgtFileNode.id)
				} else {
					addEdge(srcFileNode.id, targetNode.id)
				}
			}
		}
	}

	return {
		nodes: Array.from(nodeMap.values()),
		edges,
	}
}
