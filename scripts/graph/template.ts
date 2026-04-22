export function getHtml(port: number): string {
	return /* html */ `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>my-time — Feature Graph</title>
  <script src="https://cdn.jsdelivr.net/npm/d3@7/dist/d3.min.js"></script>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #0d1117; color: #c9d1d9; font-family: monospace; overflow: hidden; }
    #toolbar {
      position: fixed; top: 0; left: 0; right: 0; z-index: 10;
      background: #161b22; border-bottom: 1px solid #30363d;
      padding: 8px 16px; display: flex; align-items: center; gap: 16px; font-size: 12px;
    }
    #status { color: #f85149; }
    #stats { margin-left: auto; color: #8b949e; }
    button {
      background: #21262d; border: 1px solid #30363d; color: #c9d1d9;
      padding: 3px 10px; border-radius: 4px; cursor: pointer; font-family: monospace; font-size: 11px;
    }
    button:hover { background: #30363d; }
    svg { display: block; }
  </style>
</head>
<body>
  <div id="toolbar">
    <span id="status">● connecting...</span>
    <span>my-time — feature graph</span>
    <span id="stats"></span>
    <button onclick="resetZoom()">reset zoom</button>
  </div>
  <svg id="graph"></svg>

  <script>
    const PORT = ${port}

    let allNodes = []
    let allEdges = []
    const expanded = new Set()
    let simulation = null

    const svg = d3.select('#graph')
    const g = svg.append('g')

    const zoom = d3.zoom().on('zoom', e => g.attr('transform', e.transform))
    svg.call(zoom)

    function resize() {
      svg.attr('width', window.innerWidth).attr('height', window.innerHeight - 37)
    }
    resize()
    window.addEventListener('resize', resize)

    function colorFor(node) {
      if (node.app === 'web') return '#388bfd'
      if (node.app === 'api') return '#3fb950'
      if (node.app === 'extension') return '#ffa657'
      return '#d2a8ff'
    }

    function getVisibleNodes() {
      return allNodes.filter(n => {
        if (n.type !== 'file') return true
        return expanded.has(n.parent)
      })
    }

    function getVisibleEdges(visibleNodes) {
      const visIds = new Set(visibleNodes.map(n => n.id))
      const edgeMap = new Map()
      const nodeById = new Map(allNodes.map(n => [n.id, n]))

      for (const edge of allEdges) {
        let src = edge.source
        let tgt = edge.target

        const srcNode = nodeById.get(src)
        const tgtNode = nodeById.get(tgt)

        if (srcNode?.type === 'file' && !expanded.has(srcNode.parent)) src = srcNode.parent
        if (tgtNode?.type === 'file' && !expanded.has(tgtNode.parent)) tgt = tgtNode.parent

        if (src === tgt) continue
        if (!visIds.has(src) || !visIds.has(tgt)) continue

        const key = src + '→' + tgt
        if (!edgeMap.has(key)) edgeMap.set(key, { source: src, target: tgt })
      }

      return Array.from(edgeMap.values())
    }

    function render() {
      const nodes = getVisibleNodes()
      const edges = getVisibleEdges(nodes)

      document.getElementById('stats').textContent =
        'nodes: ' + nodes.length + '  |  edges: ' + edges.length

      if (simulation) simulation.stop()
      g.selectAll('*').remove()

      const defs = g.append('defs')
      defs.append('marker')
        .attr('id', 'arrow')
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 24).attr('refY', 0)
        .attr('markerWidth', 6).attr('markerHeight', 6)
        .attr('orient', 'auto')
        .append('path').attr('d', 'M0,-5L10,0L0,5').attr('fill', '#30363d')

      const link = g.append('g')
        .selectAll('line')
        .data(edges)
        .join('line')
        .attr('stroke', '#30363d')
        .attr('stroke-width', 1.5)
        .attr('marker-end', 'url(#arrow)')

      const node = g.append('g')
        .selectAll('g')
        .data(nodes, d => d.id)
        .join('g')
        .attr('cursor', d => d.type === 'file' ? 'default' : 'pointer')
        .call(d3.drag()
          .on('start', (event, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart()
            d.fx = d.x; d.fy = d.y
          })
          .on('drag', (event, d) => { d.fx = event.x; d.fy = event.y })
          .on('end', (event, d) => {
            if (!event.active) simulation.alphaTarget(0)
            d.fx = null; d.fy = null
          })
        )
        .on('click', (_, d) => {
          if (d.type === 'file') return
          if (expanded.has(d.id)) expanded.delete(d.id)
          else expanded.add(d.id)
          render()
        })
        .on('mouseover', (_, d) => {
          link
            .attr('stroke', e => (e.source.id === d.id || e.target.id === d.id) ? '#58a6ff' : '#1c2128')
            .attr('stroke-width', e => (e.source.id === d.id || e.target.id === d.id) ? 2.5 : 1)
        })
        .on('mouseout', () => {
          link.attr('stroke', '#30363d').attr('stroke-width', 1.5)
        })

      node.append('circle')
        .attr('r', d => d.type === 'file' ? 8 : 20)
        .attr('fill', d => colorFor(d))
        .attr('opacity', d => d.type === 'file' ? 0.65 : 0.85)

      node.append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', '0.35em')
        .attr('font-size', d => d.type === 'file' ? 7 : 9)
        .attr('fill', 'white')
        .attr('pointer-events', 'none')
        .text(d => d.label)

      node.filter(d => d.type !== 'file')
        .append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', '2.8em')
        .attr('font-size', 7)
        .attr('fill', '#8b949e')
        .attr('pointer-events', 'none')
        .text(d => expanded.has(d.id) ? '▲' : '▼')

      const W = +svg.attr('width')
      const H = +svg.attr('height')

      simulation = d3.forceSimulation(nodes)
        .force('link', d3.forceLink(edges).id(d => d.id).distance(100))
        .force('charge', d3.forceManyBody().strength(d => d.type === 'file' ? -80 : -250))
        .force('center', d3.forceCenter(W / 2, H / 2))
        .force('collision', d3.forceCollide(d => d.type === 'file' ? 14 : 32))
        .on('tick', () => {
          link
            .attr('x1', d => d.source.x).attr('y1', d => d.source.y)
            .attr('x2', d => d.target.x).attr('y2', d => d.target.y)
          node.attr('transform', d => 'translate(' + d.x + ',' + d.y + ')')
        })
    }

    function resetZoom() {
      svg.transition().duration(500).call(zoom.transform, d3.zoomIdentity
        .translate(+svg.attr('width') / 2, +svg.attr('height') / 2)
        .scale(1)
        .translate(-+svg.attr('width') / 2, -+svg.attr('height') / 2)
      )
    }

    function connect() {
      const ws = new WebSocket('ws://localhost:' + PORT)
      ws.onopen = () => {
        const el = document.getElementById('status')
        el.textContent = '● live'
        el.style.color = '#3fb950'
      }
      ws.onmessage = e => {
        const msg = JSON.parse(e.data)
        allNodes = msg.data.nodes
        allEdges = msg.data.edges
        render()
      }
      ws.onclose = () => {
        const el = document.getElementById('status')
        el.textContent = '● reconnecting...'
        el.style.color = '#f85149'
        setTimeout(connect, 2000)
      }
    }

    connect()
  </script>
</body>
</html>`
}
