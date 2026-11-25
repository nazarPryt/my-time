import type { GraphNode } from './types'

export interface NodeChain {
	app: GraphNode // top-level group: a workspace package or a root folder
	feature: GraphNode // module inside the group (auth, shared, db, ...)
	file: GraphNode // the individual file
}

const ROOT_GROUP = '(root)'
// Folders whose children are the real modules, e.g. src/features/<module>/.
const MODULE_CONTAINERS = new Set(['features', 'feature'])

function stripExt(p: string): string {
	return p.replace(/\.[^./]+$/, '')
}

// The group is the deepest workspace (folder with a package.json) holding the
// file; files outside every workspace are grouped by their top-level folder.
function findGroup(rel: string, workspaces: string[]): string {
	let best = ''
	for (const ws of workspaces) {
		if (rel.startsWith(`${ws}/`) && ws.length > best.length) best = ws
	}
	if (best) return best
	const slash = rel.indexOf('/')
	return slash === -1 ? ROOT_GROUP : rel.slice(0, slash)
}

// Returns the group → module → file chain for a repo-relative file path.
export function chainForFile(rel: string, workspaces: string[]): NodeChain {
	const group = findGroup(rel, workspaces)
	const inGroup = group === ROOT_GROUP ? rel : rel.slice(group.length + 1)

	const parts = inGroup.replace(/^src\//, '').split('/')
	if (parts.length > 2 && MODULE_CONTAINERS.has(parts[0])) parts.shift()
	const feature = parts.length > 1 ? (parts.shift() as string) : ROOT_GROUP
	const fileSubPath = stripExt(parts.join('/'))

	const featureId = `${group}::${feature}`
	return {
		app: { id: group, label: group, app: group, type: 'app' },
		feature: {
			id: featureId,
			label: feature,
			app: group,
			type: 'feature',
			parent: group,
		},
		file: {
			id: `${featureId}::${fileSubPath}`,
			label: fileSubPath,
			app: group,
			type: 'file',
			parent: featureId,
		},
	}
}
