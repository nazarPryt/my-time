import { Link } from '@tanstack/react-router'
import { FileQuestion } from 'lucide-react'

export function NotFoundScreen() {
	return (
		<div
			data-testid="not-found-screen"
			className="min-h-screen bg-background flex items-center justify-center p-6"
		>
			<div className="max-w-sm w-full rounded-xl border border-border bg-card p-8 flex flex-col items-center gap-5 text-center">
				<div className="rounded-full bg-muted p-3">
					<FileQuestion
						size={22}
						strokeWidth={1.75}
						className="text-muted-foreground"
					/>
				</div>
				<div className="space-y-1.5">
					<h1 className="text-base font-semibold text-foreground">
						Page not found
					</h1>
					<p className="text-xs text-muted-foreground leading-relaxed">
						The page you're looking for doesn't exist.
					</p>
				</div>
				<Link
					to="/"
					className="text-xs text-muted-foreground hover:text-foreground transition-colors"
				>
					Go home
				</Link>
			</div>
		</div>
	)
}
