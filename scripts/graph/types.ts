export type NodeType = "feature" | "file" | "package"
export type AppName = "web" | "api" | "extension" | null

export interface GraphNode {
  id: string       // e.g. "web/auth", "web/auth/useLogin", "contracts/auth"
  label: string    // display name
  app: AppName
  type: NodeType
  parent?: string  // file nodes only — owner feature id
}

export interface GraphEdge {
  source: string   // node id
  target: string   // node id
}

export interface GraphData {
  nodes: GraphNode[]
  edges: GraphEdge[]
}