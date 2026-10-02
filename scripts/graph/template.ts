export function getHtml(port: number): string {
	return /* html */ `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>my-time — Module Graph</title>
  <script src="https://cdn.jsdelivr.net/npm/d3@7/dist/d3.min.js"></script>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #0d1117; color: #c9d1d9; font-family: monospace; overflow: hidden; }
    #toolbar {
      position: fixed; top: 0; left: 0; right: 0; z-index: 10;
      background: #161b22; border-bottom: 1px solid #30363d;
      padding: 8px 16px; display: flex; align-items: center; gap: 12px; font-size: 12px;
    }
    #status { color: #f85149; }
    #stats { margin-left: auto; color: #8b949e; }
    button {
      background: #21262d; border: 1px solid #30363d; color: #c9d1d9;
      padding: 3px 10px; border-radius: 4px; cursor: pointer; font-family: monospace; font-size: 11px;
    }
    button:hover { background: #30363d; }
    svg { display: block; }
    #legend {
      position: fixed; bottom: 12px; left: 12px; z-index: 10;
      background: #161b22cc; border: 1px solid #30363d; border-radius: 6px;
      padding: 10px 12px; font-size: 11px; line-height: 1.7; color: #8b949e;
    }
    #legend b { color: #c9d1d9; }
    .swatch { display: inline-block; width: 10px; height: 10px; border-radius: 2px; margin-right: 6px; vertical-align: middle; }
    .line { display: inline-block; width: 16px; height: 0; border-top-width: 3px; border-top-style: solid; margin-right: 6px; vertical-align: middle; }
    #info {
      position: fixed; top: 45px; right: 12px; z-index: 10; min-width: 180px;
      background: #161b22ee; border: 1px solid #30363d; border-radius: 6px;
      padding: 10px 12px; font-size: 11px; line-height: 1.6; color: #c9d1d9;
      display: none;
    }
    #info .muted { color: #8b949e; }
    #info .dep { color: #58a6ff; }
    #info .imp { color: #f778ba; }
  </style>
</head>
<body>
  <div id="toolbar">
    <span id="status">● connecting...</span>
    <span>my-time — module graph</span>
    <button onclick="expandAll()">expand all</button>
    <button onclick="collapseAll()">collapse all</button>
    <button onclick="resetZoom()">reset zoom</button>
    <span id="stats"></span>
  </div>
  <svg id="graph"></svg>

  <div id="legend">
    <div><b>apps</b></div>
    <div><span class="swatch" style="background:#388bfd"></span>web
         <span class="swatch" style="background:#3fb950;margin-left:8px"></span>api
         <span class="swatch" style="background:#ffa657;margin-left:8px"></span>extension</div>
    <div><span class="swatch" style="background:#f778ba"></span>mobile
         <span class="swatch" style="background:#d2a8ff;margin-left:8px"></span>contracts
         <span class="swatch" style="background:#e3b341;margin-left:8px"></span>packages</div>
    <div style="margin-top:6px"><b>imports</b></div>
    <div><span class="line" style="border-top-color:#2ea043"></span>same app (cohesion)</div>
    <div><span class="line" style="border-top-color:#f0883e"></span>cross app (coupling)</div>
    <div style="margin-top:6px"><b>hover a node</b></div>
    <div><span class="line" style="border-top-color:#58a6ff"></span>it imports (dependencies)</div>
    <div><span class="line" style="border-top-color:#f778ba"></span>imports it (dependents)</div>
    <div style="margin-top:6px" class="muted">click = expand/collapse · thicker = more imports</div>
  </div>

  <div id="info"></div>

  <script>
    const PORT = ${port}

    let allNodes = []
    let allEdges = []
    const expanded = new Set() // ids of app/feature nodes the user has opened
    let simulation = null
    let byId = new Map()

    const svg = d3.select('#graph')
    const g = svg.append('g')

    const zoom = d3.zoom().on('zoom', e => g.attr('transform', e.transform))
    svg.call(zoom)

    function resize() {
      svg.attr('width', window.innerWidth).attr('height', window.innerHeight - 37)
    }
    resize()
    window.addEventListener('resize', resize)

    const APP_COLORS = {
      web: '#388bfd', api: '#3fb950', extension: '#ffa657',
      mobile: '#f778ba', contracts: '#d2a8ff',
    }
    function colorFor(node) {
      if (APP_COLORS[node.app]) return APP_COLORS[node.app]
      if (node.app.startsWith('packages/')) return '#e3b341'
      return '#8b949e'
    }

    // Nearest visible ancestor of a node id: climb until we hit a node whose
    // parent is expanded (and itself displayed). Apps are always visible.
    function displayId(id) {
      const n = byId.get(id)
      if (!n || !n.parent) return id
      if (expanded.has(n.parent) && displayId(n.parent) === n.parent) return id
      return displayId(n.parent)
    }

    function getVisibleNodes() {
      return allNodes.filter(n => displayId(n.id) === n.id)
    }

    function getVisibleEdges() {
      const map = new Map()
      for (const e of allEdges) {
        const src = displayId(e.source)
        const tgt = displayId(e.target)
        if (src === tgt) continue // collapsed into the same box → internal, hide
        const key = src + '→' + tgt
        const ex = map.get(key)
        if (ex) { ex.count += e.count }
        else {
          const sameApp = byId.get(src).app === byId.get(tgt).app
          map.set(key, { source: src, target: tgt, count: e.count, cohesion: sameApp })
        }
      }
      return Array.from(map.values())
    }

    function radiusFor(d) {
      if (d.type === 'app') return 26
      if (d.type === 'feature') return 15
      return 6
    }

    function hasChildren(d) { return d.type !== 'file' }

    function showInfo(d, edges) {
      const deps = edges.filter(e => e.source.id === d.id)
      const imps = edges.filter(e => e.target.id === d.id)
      const sum = arr => arr.reduce((a, e) => a + e.count, 0)
      const info = document.getElementById('info')
      info.style.display = 'block'
      info.innerHTML =
        '<div><b>' + d.label + '</b> <span class="muted">(' + d.type + ')</span></div>' +
        '<div class="muted">app: ' + d.app + '</div>' +
        '<div class="dep">imports → ' + deps.length + ' modules (' + sum(deps) + ' refs)</div>' +
        '<div class="imp">imported by ← ' + imps.length + ' modules (' + sum(imps) + ' refs)</div>' +
        (hasChildren(d) ? '<div class="muted">click to ' + (expanded.has(d.id) ? 'collapse' : 'expand') + '</div>' : '')
    }
    function hideInfo() { document.getElementById('info').style.display = 'none' }

    function render() {
      byId = new Map(allNodes.map(n => [n.id, n]))
      const nodes = getVisibleNodes()
      const edges = getVisibleEdges()

      const coupling = edges.filter(e => !e.cohesion).length
      document.getElementById('stats').textContent =
        'nodes: ' + nodes.length + '  |  imports: ' + edges.length + '  |  cross-app: ' + coupling

      if (simulation) simulation.stop()
      g.selectAll('*').remove()

      const defs = g.append('defs')
      for (const [id, color] of [['arrow-co', '#2ea043'], ['arrow-cp', '#f0883e'], ['arrow-hl', '#58a6ff']]) {
        defs.append('marker')
          .attr('id', id).attr('viewBox', '0 -5 10 10')
          .attr('refX', 22).attr('refY', 0)
          .attr('markerWidth', 5).attr('markerHeight', 5).attr('orient', 'auto')
          .append('path').attr('d', 'M0,-5L10,0L0,5').attr('fill', color)
      }

      const link = g.append('g')
        .selectAll('line')
        .data(edges)
        .join('line')
        .attr('stroke', d => d.cohesion ? '#2ea043' : '#f0883e')
        .attr('stroke-opacity', d => d.cohesion ? 0.35 : 0.75)
        .attr('stroke-width', d => Math.min(1 + d.count * 0.6, 6))
        .attr('marker-end', d => d.cohesion ? 'url(#arrow-co)' : 'url(#arrow-cp)')

      const node = g.append('g')
        .selectAll('g')
        .data(nodes, d => d.id)
        .join('g')
        .attr('cursor', d => hasChildren(d) ? 'pointer' : 'default')
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
          if (!hasChildren(d)) return
          if (expanded.has(d.id)) expanded.delete(d.id)
          else expanded.add(d.id)
          render()
        })
        .on('mouseover', (_, d) => {
          link
            .attr('stroke', e => e.source.id === d.id ? '#58a6ff' : e.target.id === d.id ? '#f778ba' : (e.cohesion ? '#2ea043' : '#f0883e'))
            .attr('stroke-opacity', e => (e.source.id === d.id || e.target.id === d.id) ? 0.95 : 0.06)
            .attr('stroke-width', e => (e.source.id === d.id || e.target.id === d.id) ? Math.min(2 + e.count * 0.6, 7) : Math.min(1 + e.count * 0.6, 6))
          const connected = new Set([d.id])
          for (const e of edges) {
            if (e.source.id === d.id) connected.add(e.target.id)
            if (e.target.id === d.id) connected.add(e.source.id)
          }
          node.attr('opacity', n => connected.has(n.id) ? 1 : 0.15)
          showInfo(d, edges)
        })
        .on('mouseout', () => {
          link
            .attr('stroke', e => e.cohesion ? '#2ea043' : '#f0883e')
            .attr('stroke-opacity', e => e.cohesion ? 0.35 : 0.75)
            .attr('stroke-width', e => Math.min(1 + e.count * 0.6, 6))
          node.attr('opacity', 1)
          hideInfo()
        })

      node.append('circle')
        .attr('r', radiusFor)
        .attr('fill', colorFor)
        .attr('stroke', d => hasChildren(d) && expanded.has(d.id) ? '#c9d1d9' : 'none')
        .attr('stroke-width', 1.5)
        .attr('opacity', d => d.type === 'file' ? 0.7 : 0.9)

      node.append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', d => radiusFor(d) + 10)
        .attr('font-size', d => d.type === 'app' ? 11 : d.type === 'feature' ? 9 : 7)
        .attr('fill', d => d.type === 'app' ? '#e6edf3' : '#8b949e')
        .attr('pointer-events', 'none')
        .text(d => d.label)

      node.filter(d => hasChildren(d))
        .append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', '0.35em')
        .attr('font-size', 9)
        .attr('fill', '#0d1117')
        .attr('pointer-events', 'none')
        .text(d => expanded.has(d.id) ? '−' : '+')

      const W = +svg.attr('width')
      const H = +svg.attr('height')

      simulation = d3.forceSimulation(nodes)
        .force('link', d3.forceLink(edges).id(d => d.id).distance(d => d.cohesion ? 70 : 130))
        .force('charge', d3.forceManyBody().strength(d => d.type === 'app' ? -600 : d.type === 'feature' ? -250 : -90))
        .force('center', d3.forceCenter(W / 2, H / 2))
        .force('collision', d3.forceCollide(d => radiusFor(d) + 12))
        .on('tick', () => {
          link
            .attr('x1', d => d.source.x).attr('y1', d => d.source.y)
            .attr('x2', d => d.target.x).attr('y2', d => d.target.y)
          node.attr('transform', d => 'translate(' + d.x + ',' + d.y + ')')
        })
    }

    function expandAll() {
      for (const n of allNodes) if (n.type !== 'file') expanded.add(n.id)
      render()
    }
    function collapseAll() {
      expanded.clear()
      render()
    }

    function resetZoom() {
      svg.transition().duration(500).call(zoom.transform, d3.zoomIdentity)
    }

    function connect() {
      const ws = new WebSocket('ws://localhost:' + PORT)
      ws.onopen = () => {
        const el = document.getElementById('status')
        el.textContent = '● live'; el.style.color = '#3fb950'
      }
      ws.onmessage = e => {
        const msg = JSON.parse(e.data)
        allNodes = msg.data.nodes
        allEdges = msg.data.edges
        render()
      }
      ws.onclose = () => {
        const el = document.getElementById('status')
        el.textContent = '● reconnecting...'; el.style.color = '#f85149'
        setTimeout(connect, 2000)
      }
    }

    connect()
  </script>
</body>
</html>`
}
