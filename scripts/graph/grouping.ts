import path from 'node:path'
import type { GraphNode } from './types'

export interface NodeChain {
	app: GraphNode // top-level group (web, api, contracts, ...)
	feature: GraphNode // module inside the group (auth, shared, db, ...)
	file: GraphNode // the individual file
}

interface FileDescriptor {
	groupId: string // top-level group id, e.g. "web" or "packages/features"
	groupLabel: string // display label for the group
	featureName: string // module name within the group
	fileSubPath: string // path from the feature root, extension stripped
}

function stripExt(p: string): string {
	return p.replace(/\.[^./]+$/, '')
}

function grp(
	groupId: string,
	groupLabel: string,
	featureName: string,
	fileRel: string,
): FileDescriptor {
	return { groupId, groupLabel, featureName, fileSubPath: stripExt(fileRel) }
}

// Ordered matchers — first match wins. Feature dirs must precede the generic
// "any dir" rule, and specific files (root) come last.
const MATCHERS: Array<{
	re: RegExp
	build: (m: RegExpMatchArray) => FileDescriptor
}> = [
	// web (FSD: apps/web/src/features/<name>/...)
	{
		re: /^apps\/web\/src\/features\/([^/]+)\/(.+)$/,
		build: (m) => grp('web', 'web', m[1], m[2]),
	},
	{
		re: /^apps\/web\/src\/([^/]+)\/(.+)$/,
		build: (m) => grp('web', 'web', m[1], m[2]),
	},
	{
		re: /^apps\/web\/src\/(.+)$/,
		build: (m) => grp('web', 'web', '(root)', m[1]),
	},
	// api
	{
		re: /^apps\/api\/src\/features\/([^/]+)\/(.+)$/,
		build: (m) => grp('api', 'api', m[1], m[2]),
	},
	{
		re: /^apps\/api\/src\/([^/]+)\/(.+)$/,
		build: (m) => grp('api', 'api', m[1], m[2]),
	},
	{
		re: /^apps\/api\/src\/(.+)$/,
		build: (m) => grp('api', 'api', '(root)', m[1]),
	},
	// extension
	{
		re: /^apps\/extension\/src\/features\/([^/]+)\/(.+)$/,
		build: (m) => grp('extension', 'extension', m[1], m[2]),
	},
	{
		re: /^apps\/extension\/src\/([^/]+)\/(.+)$/,
		build: (m) => grp('extension', 'extension', m[1], m[2]),
	},
	{
		re: /^apps\/extension\/src\/(.+)$/,
		build: (m) => grp('extension', 'extension', '(root)', m[1]),
	},
	// mobile (no src/; uses singular "feature")
	{
		re: /^apps\/mobile\/feature\/([^/]+)\/(.+)$/,
		build: (m) => grp('mobile', 'mobile', m[1], m[2]),
	},
	{
		re: /^apps\/mobile\/([^/]+)\/(.+)$/,
		build: (m) => grp('mobile', 'mobile', m[1], m[2]),
	},
	// contracts
	{
		re: /^contracts\/src\/features\/([^/]+)\/(.+)$/,
		build: (m) => grp('contracts', 'contracts', m[1], m[2]),
	},
	{
		re: /^contracts\/src\/([^/]+)\/(.+)$/,
		build: (m) => grp('contracts', 'contracts', m[1], m[2]),
	},
	{
		re: /^contracts\/src\/(.+)$/,
		build: (m) => grp('contracts', 'contracts', '(root)', m[1]),
	},
	// packages/<pkg> — each package is its own top-level group
	{
		re: /^packages\/([^/]+)\/src\/([^/]+)\/(.+)$/,
		build: (m) => grp(`packages/${m[1]}`, m[1], m[2], m[3]),
	},
	{
		re: /^packages\/([^/]+)\/src\/(.+)$/,
		build: (m) => grp(`packages/${m[1]}`, m[1], '(root)', m[2]),
	},
]

function describe(rel: string): FileDescriptor | null {
	for (const { re, build } of MATCHERS) {
		const m = rel.match(re)
		if (m) return build(m)
	}
	return null
}

// Returns the app → feature → file node chain for a file, or null if the file
// falls outside any tracked workspace group.
export function chainForFile(filePath: string, root: string): NodeChain | null {
	const rel = path.relative(root, filePath).replace(/\\/g, '/')
	const d = describe(rel)
	if (!d) return null

	const featureId = `${d.groupId}/${d.featureName}`

	return {
		app: { id: d.groupId, label: d.groupLabel, app: d.groupId, type: 'app' },
		feature: {
			id: featureId,
			label: d.featureName,
			app: d.groupId,
			type: 'feature',
			parent: d.groupId,
		},
		file: {
			id: `${featureId}/${d.fileSubPath}`,
			label: d.fileSubPath,
			app: d.groupId,
			type: 'file',
			parent: featureId,
		},
	}
}
