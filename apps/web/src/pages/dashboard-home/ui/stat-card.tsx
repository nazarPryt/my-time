export function StatCard({
	label,
	value,
	sub,
}: {
	label: string
	value: string
	sub?: string
}) {
	return (
		<div className="rounded-xl border border-border bg-card p-5 flex flex-col gap-1">
			<span className="text-xs font-medium tracking-wide uppercase text-muted-foreground/70">
				{label}
			</span>
			<span className="text-2xl font-bold tracking-tight text-foreground">
				{value}
			</span>
			{sub && <span className="text-xs text-muted-foreground">{sub}</span>}
		</div>
	)
}
