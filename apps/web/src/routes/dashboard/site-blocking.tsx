import { createFileRoute } from '@tanstack/react-router'
import { format } from 'date-fns'
import { PuzzleIcon, ShieldOff, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { Input } from '@/components/ui/input'
import { useSiteBlockingStore } from '@/feature/site-blocking/store'

export const Route = createFileRoute('/dashboard/site-blocking')({
	component: SiteBlockingPage,
})

function SiteBlockingPage() {
	const {
		sites,
		loading,
		submitting,
		error,
		connectingExtension,
		loadSites,
		addSite,
		removeSite,
		connectExtension,
	} = useSiteBlockingStore()
	const [input, setInput] = useState('')

	useEffect(() => {
		void loadSites()
	}, [loadSites])

	async function handleAdd(e: React.FormEvent) {
		e.preventDefault()
		const trimmed = input.trim()
		if (!trimmed) return
		await addSite(trimmed)
		setInput('')
	}

	return (
		<div className="h-full flex flex-col">
			<header className="h-14 flex items-center justify-between px-8 border-b border-border shrink-0">
				<h1 className="text-sm font-semibold text-foreground">Site Blocking</h1>
				<Button
					variant="outline"
					size="sm"
					onClick={connectExtension}
					disabled={connectingExtension}
					className="gap-2"
				>
					<PuzzleIcon size={14} />
					{connectingExtension ? 'Connecting…' : 'Connect Extension'}
				</Button>
			</header>

			<div className="flex-1 overflow-auto p-8">
				<div className="max-w-lg mx-auto space-y-6">
					{/* Add form */}
					<form onSubmit={handleAdd} className="flex gap-2">
						<Input
							placeholder="e.g. reddit.com"
							value={input}
							onChange={(e) => setInput(e.target.value)}
							disabled={submitting}
							className="flex-1"
						/>
						<Button type="submit" disabled={submitting || !input.trim()}>
							Block
						</Button>
					</form>

					{error && <p className="text-sm text-destructive">{error}</p>}

					{/* Site list */}
					<div className="rounded-xl border border-border bg-card overflow-hidden">
						{loading ? (
							<div className="flex items-center justify-center h-32">
								<span className="text-xs text-muted-foreground">Loading…</span>
							</div>
						) : sites.length === 0 ? (
							<div className="flex flex-col items-center justify-center gap-2 h-32 text-center px-6">
								<ShieldOff size={20} className="text-muted-foreground/40" />
								<span className="text-xs text-muted-foreground">
									No sites blocked yet
								</span>
							</div>
						) : (
							<ul className="divide-y divide-border">
								{sites.map((site) => (
									<li
										key={site.id}
										className="flex items-center justify-between px-4 py-3"
									>
										<div>
											<p className="text-sm font-medium text-foreground">
												{site.domain}
											</p>
											<p className="text-xs text-muted-foreground">
												Added {format(new Date(site.createdAt), 'MMM d, yyyy')}
											</p>
										</div>
										<ConfirmDialog
											trigger={
												<Button
													variant="ghost"
													size="icon"
													className="text-muted-foreground hover:text-destructive"
												>
													<Trash2 size={15} />
												</Button>
											}
											title="Remove blocked site"
											description={`Are you sure you want to unblock "${site.domain}"?`}
											confirmLabel="Remove"
											variant="destructive"
											onConfirm={() => removeSite(site.id)}
										/>
									</li>
								))}
							</ul>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}
