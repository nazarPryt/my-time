// Three-level hierarchy: app (top-level workspace group) → feature (module) → file.
// `app` on every node is the top-level group id, used to tell cohesion
// (same-app import) apart from coupling (cross-app import).
export type NodeType = 'app' | 'feature' | 'file'

export interface GraphNode {
	id: string // e.g. "web", "web/auth", "web/auth/login/useLogin"
	label: string // display name
	app: string // top-level group id this node belongs to ("web", "api", "contracts", ...)
	type: NodeType
	parent?: string // parent node id (feature → app, file → feature); apps have none
}

export interface GraphEdge {
	source: string // node id (importer)
	target: string // node id (imported)
	count: number // number of underlying file-level imports collapsed into this edge
}

export interface GraphData {
	nodes: GraphNode[]
	edges: GraphEdge[]
}
