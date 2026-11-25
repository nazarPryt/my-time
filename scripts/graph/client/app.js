// Dependency explorer: sidebar tree, app-by-app overview, and a focus view
// (used by → selected → depends on) for any app, module or file.

const PALETTE = [
	'#388bfd',
	'#3fb950',
	'#ffa657',
	'#f778ba',
	'#d2a8ff',
	'#56d4dd',
	'#ff7b72',
	'#e3b341',
	'#a5d6ff',
	'#7ee787',
	'#db61a2',
	'#79c0ff',
	'#ffa198',
	'#bc8cff',
	'#8b949e',
]
const CARD_LIMIT = 40
const TYPE_NAME = { app: 'app / package', feature: 'module', file: 'file' }

const state = {
	nodes: [],
	edges: [],
	byId: new Map(),
	children: new Map(),
	fileCount: new Map(),
	colors: new Map(),
	open: new Set(),
	search: '',
	pickedCell: null,
	showAll: new Set(),
}

// ---------- tiny DOM helper ----------

function h(tag, props, ...children) {
	const el = document.createElement(tag)
	for (const [key, value] of Object.entries(props ?? {})) {
		if (value == null || value === false) continue
		if (key.startsWith('on')) el.addEventListener(key.slice(2), value)
		else if (key === 'style') el.style.cssText = value
		else el.setAttribute(key, value === true ? '' : value)
	}
	for (const child of children.flat()) {
		if (child == null || child === false) continue
		el.append(child instanceof Node ? child : String(child))
	}
	return el
}

// replaceChildren() would print null/false as text, so drop them first.
function setChildren(el, ...children) {
	el.replaceChildren(...children.flat().filter((c) => c != null && c !== false))
}

function svgEl(tag, attrs) {
	const el = document.createElementNS('http://www.w3.org/2000/svg', tag)
	for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v)
	return el
}

// ---------- data indexes ----------

function index(data) {
	state.nodes = data.nodes
	state.edges = data.edges
	state.byId = new Map(data.nodes.map((n) => [n.id, n]))
	state.children = new Map()
	state.fileCount = new Map()
	for (const n of data.nodes) {
		if (!n.parent) continue
		if (!state.children.has(n.parent)) state.children.set(n.parent, [])
		state.children.get(n.parent).push(n.id)
	}
	for (const list of state.children.values()) {
		list.sort((a, b) => label(a).localeCompare(label(b)))
	}
	for (const n of data.nodes) {
		if (n.type !== 'file') continue
		for (let id = n.id; id; id = state.byId.get(id)?.parent) {
			state.fileCount.set(id, (state.fileCount.get(id) ?? 0) + 1)
		}
	}
	const apps = appIds()
	state.colors = new Map(apps.map((id, i) => [id, PALETTE[i % PALETTE.length]]))
}

const appIds = () =>
	state.nodes
		.filter((n) => n.type === 'app')
		.map((n) => n.id)
		.sort()
const label = (id) => state.byId.get(id)?.label ?? id
const colorOf = (id) => state.colors.get(state.byId.get(id)?.app) ?? '#8b949e'

// The node of the given type that contains (or is) this node.
function ancestorAt(id, type) {
	let n = state.byId.get(id)
	while (n && n.type !== type) n = state.byId.get(n.parent)
	return n?.id ?? id
}

// "apps/web › auth" style location of a node, without the node itself.
function whereIs(id) {
	const parts = []
	let n = state.byId.get(state.byId.get(id)?.parent)
	while (n) {
		parts.unshift(n.label)
		n = state.byId.get(n.parent)
	}
	return parts.join(' › ')
}

// Neighbours of a node at its own level, with the file imports behind them.
function neighbours(id) {
	const type = state.byId.get(id).type
	const usedBy = new Map()
	const dependsOn = new Map()
	let internal = 0
	const add = (map, key, edge) => {
		const entry = map.get(key) ?? { id: key, count: 0, pairs: [] }
		entry.count += edge.count
		entry.pairs.push(edge)
		map.set(key, entry)
	}
	for (const e of state.edges) {
		const from = ancestorAt(e.source, type)
		const to = ancestorAt(e.target, type)
		if (from === id && to === id) internal += e.count
		else if (from === id) add(dependsOn, to, e)
		else if (to === id) add(usedBy, from, e)
	}
	const sorted = (map) =>
		[...map.values()].sort(
			(a, b) => b.count - a.count || a.id.localeCompare(b.id),
		)
	return { usedBy: sorted(usedBy), dependsOn: sorted(dependsOn), internal }
}

// ---------- routing (hash keeps the browser Back button working) ----------

function selectedId() {
	const id = decodeURIComponent(locationHash())
	return state.byId.has(id) ? id : null
}
function locationHash() {
	return window.location.hash.replace(/^#\/?/, '')
}
function go(id) {
	window.location.hash = id ? `/${encodeURIComponent(id)}` : ''
}

// ---------- sidebar tree ----------

function renderTree() {
	const tree = document.getElementById('tree')
	const selected = selectedId()
	const q = state.search.trim().toLowerCase()

	if (q) {
		const hits = state.nodes
			.filter((n) => n.id.toLowerCase().includes(q))
			.sort((a, b) => a.id.length - b.id.length)
			.slice(0, 200)
		setChildren(
			tree,
			...hits.map((n) => treeRow(n.id, 0, selected, whereIs(n.id))),
			hits.length
				? null
				: h('p', { class: 'hint', style: 'padding:8px' }, 'No matches'),
		)
		return
	}

	const rows = []
	const walk = (id, depth) => {
		rows.push(treeRow(id, depth, selected))
		if (!state.open.has(id)) return
		for (const child of state.children.get(id) ?? []) walk(child, depth + 1)
	}
	for (const id of appIds()) walk(id, 0)
	tree.replaceChildren(...rows)
	tree.querySelector('.selected')?.scrollIntoView({ block: 'nearest' })
}

function treeRow(id, depth, selected, sub) {
	const node = state.byId.get(id)
	const hasKids = state.children.has(id)
	const caret = hasKids ? (state.open.has(id) ? '▾' : '▸') : ''
	const onclick = (event) => {
		const onCaret = event.target.classList.contains('caret')
		if (hasKids && (onCaret || id === selected)) {
			if (state.open.has(id)) state.open.delete(id)
			else state.open.add(id)
		} else if (hasKids) {
			state.open.add(id)
		}
		if (onCaret) renderTree()
		else if (id === selected) renderTree()
		else go(id)
	}
	return h(
		'button',
		{
			class: `tree-row${id === selected ? ' selected' : ''}`,
			style: `padding-left:${6 + depth * 16}px`,
			title: id,
			onclick,
		},
		h('span', { class: 'caret' }, caret),
		node.type === 'file'
			? null
			: h('span', { class: 'dot', style: `background:${colorOf(id)}` }),
		h(
			'span',
			{ class: 'tree-label' },
			node.label,
			sub ? h('span', { class: 'card-sub' }, ` — ${sub}`) : null,
		),
		node.type === 'file'
			? null
			: h('span', { class: 'tree-count' }, state.fileCount.get(id) ?? 0),
	)
}

// ---------- overview ----------

function renderOverview(main) {
	const apps = appIds()
	const counts = new Map()
	for (const e of state.edges) {
		const key = `${state.byId.get(e.source).app}\n${state.byId.get(e.target).app}`
		counts.set(key, (counts.get(key) ?? 0) + e.count)
	}
	const cross = [...counts].filter(([k]) => {
		const [a, b] = k.split('\n')
		return a !== b
	})
	const max = Math.max(1, ...cross.map(([, v]) => v))

	const cell = (from, to) => {
		const value = counts.get(`${from}\n${to}`) ?? 0
		if (from === to) {
			return h(
				'td',
				{ class: 'self', title: `${value} imports inside ${from}` },
				value || '',
			)
		}
		if (!value) return h('td', {}, '')
		const strength = Math.round(18 + 70 * Math.sqrt(value / max))
		const picked = state.pickedCell === `${from}\n${to}`
		return h(
			'td',
			{
				class: `hit${picked ? ' picked' : ''}`,
				title: `${from} imports ${to}: ${value} times`,
				style: `background:color-mix(in srgb, var(--cross) ${strength}%, transparent)`,
				onclick: () => {
					state.pickedCell = picked ? null : `${from}\n${to}`
					render()
				},
			},
			value,
		)
	}
	const appButton = (id) =>
		h(
			'button',
			{ onclick: () => go(id), title: `Open ${id}` },
			h('span', { class: 'dot', style: `background:${colorOf(id)}` }),
			id,
		)

	setChildren(
		main,
		h('h1', {}, 'Overview'),
		h(
			'p',
			{ class: 'hint' },
			'Each row is an app or package; the number is how many imports it makes from the app in that column. ',
			'Click a number to see exactly which modules are involved, or click any name (here or in the sidebar) to explore it.',
		),
		h(
			'div',
			{ class: 'matrix-wrap' },
			h(
				'table',
				{ class: 'matrix' },
				h(
					'thead',
					{},
					h(
						'tr',
						{},
						h(
							'th',
							{ style: 'vertical-align:bottom;text-align:left' },
							'imports from →',
						),
						apps.map((id) => h('th', {}, h('span', {}, appButton(id)))),
					),
				),
				h(
					'tbody',
					{},
					apps.map((from) =>
						h(
							'tr',
							{},
							h('th', {}, appButton(from)),
							apps.map((to) => cell(from, to)),
						),
					),
				),
			),
		),
		state.pickedCell ? cellDetails(...state.pickedCell.split('\n')) : null,
	)
}

function cellDetails(from, to) {
	const byModule = new Map()
	for (const e of state.edges) {
		if (
			state.byId.get(e.source).app !== from ||
			state.byId.get(e.target).app !== to
		)
			continue
		const key = `${state.byId.get(e.source).parent}\n${state.byId.get(e.target).parent}`
		const entry = byModule.get(key) ?? { count: 0, pairs: [] }
		entry.count += e.count
		entry.pairs.push(e)
		byModule.set(key, entry)
	}
	const rows = [...byModule].sort((a, b) => b[1].count - a[1].count)
	return h(
		'section',
		{},
		h('h2', {}, `${from} → ${to}`),
		h(
			'p',
			{ class: 'hint' },
			'Module pairs, most imports first. Expand one to see the files.',
		),
		rows.map(([key, entry]) => {
			const [a, b] = key.split('\n')
			return h(
				'details',
				{},
				h(
					'summary',
					{},
					h('button', { class: 'link', onclick: () => go(a) }, label(a)),
					' → ',
					h('button', { class: 'link', onclick: () => go(b) }, label(b)),
					h('span', { class: 'card-sub' }, `  ${entry.count} imports`),
				),
				pairList(entry.pairs),
			)
		}),
	)
}

function pairList(pairs) {
	return h(
		'ul',
		{ class: 'pairs' },
		pairs.map((p) =>
			h('li', {}, `${fileName(p.source)}  →  ${fileName(p.target)}`),
		),
	)
}

function fileName(id) {
	const n = state.byId.get(id)
	return `${n.app}/${label(n.parent) === '(root)' ? '' : `${label(n.parent)}/`}${n.label}`
}

// ---------- focus view ----------

function renderFocus(main, id) {
	const node = state.byId.get(id)
	const { usedBy, dependsOn, internal } = neighbours(id)

	const crumbs = [h('button', { onclick: () => go(null) }, 'Overview')]
	const chain = []
	for (let n = node; n; n = state.byId.get(n.parent)) chain.unshift(n)
	for (const n of chain) {
		crumbs.push(h('span', {}, '›'))
		crumbs.push(
			n.id === id
				? h('span', {}, n.label)
				: h('button', { onclick: () => go(n.id) }, n.label),
		)
	}

	const facts = [
		h('span', { class: 'badge' }, TYPE_NAME[node.type]),
		node.type === 'file'
			? null
			: h('span', { class: 'badge' }, `${state.fileCount.get(id) ?? 0} files`),
		h('span', { class: 'badge' }, `used by ${usedBy.length}`),
		h('span', { class: 'badge' }, `depends on ${dependsOn.length}`),
		node.type === 'file'
			? null
			: h('span', { class: 'badge' }, `${internal} imports inside`),
	]

	const levelWord =
		node.type === 'app' ? 'apps' : node.type === 'feature' ? 'modules' : 'files'
	const flow = h(
		'div',
		{ class: 'flow' },
		svgEl('svg', { class: 'wires' }),
		column(
			'left',
			`Used by (${usedBy.length})`,
			usedBy,
			node,
			`No other ${levelWord} import this.`,
		),
		h(
			'div',
			{ class: 'col center' },
			h('p', { class: 'col-title' }, 'Selected'),
			h(
				'div',
				{ class: 'card focus', 'data-wire': 'center' },
				h(
					'span',
					{ class: 'card-title' },
					h('span', {
						class: 'dot',
						style: `display:inline-block;margin-right:8px;background:${colorOf(id)}`,
					}),
					node.label,
				),
				h('span', { class: 'card-sub' }, whereIs(id) || TYPE_NAME[node.type]),
			),
		),
		column(
			'right',
			`Depends on (${dependsOn.length})`,
			dependsOn,
			node,
			`This imports no other ${levelWord}.`,
		),
	)

	const kids = state.children.get(id) ?? []
	setChildren(
		main,
		h('nav', { class: 'crumbs' }, crumbs),
		h('h1', {}, node.label),
		h('div', { class: 'facts' }, facts),
		h(
			'div',
			{ class: 'legend' },
			h('span', { class: 'l-same' }, 'same app'),
			h('span', { class: 'l-cross' }, 'another app'),
			h(
				'span',
				{},
				'arrows point from the importer to what it imports; thicker = more imports',
			),
		),
		flow,
		kids.length
			? h(
					'h2',
					{},
					node.type === 'app'
						? `Modules (${kids.length})`
						: `Files (${kids.length})`,
				)
			: null,
		kids.length
			? h(
					'div',
					{ class: 'grid' },
					kids.map((kid) =>
						card(
							{
								id: kid,
								count: node.type === 'app' ? state.fileCount.get(kid) : null,
							},
							node,
							'files',
						),
					),
				)
			: null,
		importDetails('Used by — details', usedBy, 'source'),
		importDetails('Depends on — details', dependsOn, 'target'),
	)
	requestAnimationFrame(() => drawWires(flow))
}

function column(side, title, items, focus, emptyText) {
	const key = `${focus.id}:${side}`
	const shown = state.showAll.has(key) ? items : items.slice(0, CARD_LIMIT)
	return h(
		'div',
		{ class: 'col' },
		h('p', { class: 'col-title' }, title),
		items.length ? null : h('div', { class: 'empty' }, emptyText),
		shown.map((item) => card(item, focus, 'imports', side)),
		items.length > shown.length
			? h(
					'button',
					{
						class: 'more',
						onclick: () => {
							state.showAll.add(key)
							render()
						},
					},
					`Show all ${items.length}`,
				)
			: null,
	)
}

function card(item, focus, unit, side) {
	const node = state.byId.get(item.id)
	const sameApp = node.app === focus.app
	return h(
		'button',
		{
			class: `card ${sameApp ? 'same' : 'cross'}`,
			'data-wire': side,
			'data-count': item.count,
			title: item.id,
			onclick: () => go(item.id),
		},
		h('span', { class: 'dot', style: `background:${colorOf(item.id)}` }),
		h(
			'span',
			{ class: 'card-text' },
			h('span', { class: 'card-title' }, node.label),
			h(
				'span',
				{ class: 'card-sub' },
				whereIs(item.id) || TYPE_NAME[node.type],
			),
		),
		item.count == null
			? null
			: h('span', { class: 'card-count' }, `${item.count} ${unit}`),
	)
}

function importDetails(title, items, end) {
	if (!items.length) return null
	return h(
		'section',
		{},
		h('h2', {}, title),
		items.map((item) =>
			h(
				'details',
				{},
				h(
					'summary',
					{},
					h(
						'button',
						{ class: 'link', onclick: () => go(item.id) },
						label(item.id),
					),
					h(
						'span',
						{ class: 'card-sub' },
						`  ${whereIs(item.id)} · ${item.count} imports`,
					),
				),
				pairList(item.pairs.sort((a, b) => a[end].localeCompare(b[end]))),
			),
		),
	)
}

function drawWires(flow) {
	const svg = flow.querySelector('.wires')
	const center = flow.querySelector('[data-wire="center"]')
	if (!svg || !center || getComputedStyle(svg).display === 'none') return
	const box = flow.getBoundingClientRect()
	const c = center.getBoundingClientRect()
	const cards = [
		...flow.querySelectorAll(
			'.card[data-wire="left"], .card[data-wire="right"]',
		),
	]
	const max = Math.max(1, ...cards.map((el) => Number(el.dataset.count)))
	const styles = getComputedStyle(document.documentElement)

	const defs = svgEl('defs', {})
	for (const kind of ['same', 'cross']) {
		const marker = svgEl('marker', {
			id: `arrow-${kind}`,
			viewBox: '0 -5 10 10',
			refX: 9,
			markerWidth: 6,
			markerHeight: 6,
			orient: 'auto',
			markerUnits: 'userSpaceOnUse',
		})
		marker.append(
			svgEl('path', {
				d: 'M0,-5L10,0L0,5',
				fill: styles.getPropertyValue(`--${kind}`),
			}),
		)
		defs.append(marker)
	}
	svg.replaceChildren(defs)

	for (const el of cards) {
		const r = el.getBoundingClientRect()
		const kind = el.classList.contains('cross') ? 'cross' : 'same'
		const left = el.dataset.wire === 'left'
		const x1 = (left ? r.right : c.right) - box.left
		const y1 = (left ? r.top + r.height / 2 : c.top + c.height / 2) - box.top
		const x2 = (left ? c.left : r.left) - box.left
		const y2 = (left ? c.top + c.height / 2 : r.top + r.height / 2) - box.top
		const mid = (x1 + x2) / 2
		const width = 1 + 4 * Math.sqrt(Number(el.dataset.count) / max)
		const path = svgEl('path', {
			d: `M${x1},${y1} C${mid},${y1} ${mid},${y2} ${x2 - 2},${y2}`,
			fill: 'none',
			stroke: styles.getPropertyValue(`--${kind}`),
			'stroke-width': width,
			'stroke-opacity': 0.55,
			'marker-end': `url(#arrow-${kind})`,
		})
		svg.append(path)
	}
}

// ---------- top level ----------

function render() {
	const main = document.getElementById('main')
	const id = selectedId()
	if (id) {
		for (
			let n = state.byId.get(state.byId.get(id).parent);
			n;
			n = state.byId.get(n.parent)
		) {
			state.open.add(n.id)
		}
		renderFocus(main, id)
	} else {
		renderOverview(main)
	}
	renderTree()
	const files = state.nodes.filter((n) => n.type === 'file').length
	document.getElementById('stats').textContent =
		`${appIds().length} apps & packages · ${files} files · ${state.edges.length} file imports`
}

function connect() {
	const ws = new WebSocket(`ws://${window.location.host}/ws`)
	const status = document.getElementById('status')
	ws.onopen = () => {
		status.textContent = '● live'
		status.classList.add('live')
	}
	ws.onmessage = (event) => {
		const scroll = document.getElementById('main').scrollTop
		index(JSON.parse(event.data).data)
		render()
		document.getElementById('main').scrollTop = scroll
	}
	ws.onclose = () => {
		status.textContent = '● reconnecting…'
		status.classList.remove('live')
		setTimeout(connect, 2000)
	}
}

window.addEventListener('hashchange', () => {
	document.getElementById('main').scrollTop = 0
	render()
})
window.addEventListener('resize', () => {
	const flow = document.querySelector('.flow')
	if (flow) drawWires(flow)
})
document.getElementById('search').addEventListener('input', (event) => {
	state.search = event.target.value
	renderTree()
})

connect()
