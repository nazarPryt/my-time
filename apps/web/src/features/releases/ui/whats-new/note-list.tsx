export function NoteList({ title, items }: { title: string; items: string[] }) {
	if (items.length === 0) return null
	return (
		<div>
			<p className="text-muted-foreground mb-1 text-xs font-medium">{title}</p>
			<ul className="list-disc space-y-1 pl-5 text-sm">
				{items.map((item) => (
					<li key={item}>{item}</li>
				))}
			</ul>
		</div>
	)
}
