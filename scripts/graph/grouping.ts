import path from 'node:path'
import type { GraphNode } from './types'

// Returns the feature/package node that owns `filePath`, or null if outside tracked scope.
export function nodeForFile(filePath: string, root: string): GraphNode | null {
	const rel = path.relative(root, filePath).replace(/\\/g, '/')

	// apps/web/src/feature/<name>/...
	const webFeature = rel.match(/^apps\/web\/src\/feature\/([^/]+)\//)
	if (webFeature) {
		const [, featureName] = webFeature
		return {
			id: `web/${featureName}`,
			label: featureName,
			app: 'web',
			type: 'feature',
		}
	}

	// apps/web/src/<dir>/... (routes, shared, components, assets)
	const webOther = rel.match(/^apps\/web\/src\/([^/]+)\//)
	if (webOther) {
		const [, dirName] = webOther
		return { id: `web/${dirName}`, label: dirName, app: 'web', type: 'feature' }
	}

	// apps/api/src/features/<name>/...
	const apiFeature = rel.match(/^apps\/api\/src\/features\/([^/]+)\//)
	if (apiFeature) {
		const [, featureName] = apiFeature
		return {
			id: `api/${featureName}`,
			label: featureName,
			app: 'api',
			type: 'feature',
		}
	}

	// apps/api/src/<dir>/... (db, shared)
	const apiOther = rel.match(/^apps\/api\/src\/([^/]+)\//)
	if (apiOther) {
		const [, dirName] = apiOther
		return { id: `api/${dirName}`, label: dirName, app: 'api', type: 'feature' }
	}

	// apps/extension/src/features/<name>/...
	const extFeature = rel.match(/^apps\/extension\/src\/features\/([^/]+)\//)
	if (extFeature) {
		const [, featureName] = extFeature
		return {
			id: `extension/${featureName}`,
			label: featureName,
			app: 'extension',
			type: 'feature',
		}
	}

	// apps/extension/src/<dir>/...
	const extOther = rel.match(/^apps\/extension\/src\/([^/]+)\//)
	if (extOther) {
		const [, dirName] = extOther
		return {
			id: `extension/${dirName}`,
			label: dirName,
			app: 'extension',
			type: 'feature',
		}
	}

	// contracts/src/features/<name>/...
	const contractsFeature = rel.match(/^contracts\/src\/features\/([^/]+)\//)
	if (contractsFeature) {
		const [, featureName] = contractsFeature
		return {
			id: `contracts/${featureName}`,
			label: featureName,
			app: null,
			type: 'package',
		}
	}

	// contracts/src/... (root level like index.ts)
	if (rel.match(/^contracts\/src\//)) {
		return { id: 'contracts', label: 'contracts', app: null, type: 'package' }
	}

	// packages/<pkgName>/src/...
	const pkg = rel.match(/^packages\/([^/]+)\/src\//)
	if (pkg) {
		const [, pkgName] = pkg
		return {
			id: `packages/${pkgName}`,
			label: pkgName,
			app: null,
			type: 'package',
		}
	}

	return null
}

// Returns the file-level node for a file. Used for drill-down. Only named feature files get one.
export function fileNodeForFile(
	filePath: string,
	root: string,
): GraphNode | null {
	const rel = path.relative(root, filePath).replace(/\\/g, '/')
	const featureNode = nodeForFile(filePath, root)
	if (!featureNode) return null

	const fileName = path.basename(filePath, path.extname(filePath))

	const isNamedFeature =
		rel.match(/^apps\/web\/src\/feature\/[^/]+\//) ||
		rel.match(/^apps\/api\/src\/features\/[^/]+\//) ||
		rel.match(/^apps\/extension\/src\/features\/[^/]+\//)

	if (!isNamedFeature) return null

	return {
		id: `${featureNode.id}/${fileName}`,
		label: fileName,
		app: featureNode.app,
		type: 'file',
		parent: featureNode.id,
	}
}
