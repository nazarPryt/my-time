import { AlertTriangle, RotateCcw } from 'lucide-react'
import { Component, type ErrorInfo, type ReactNode } from 'react'

interface ErrorScreenProps {
	error?: Error
	onReset?: () => void
}

export function ErrorScreen({ error, onReset }: ErrorScreenProps) {
	return (
		<div
			data-testid="error-screen"
			className="min-h-screen bg-background flex items-center justify-center p-6"
		>
			<div className="max-w-sm w-full rounded-xl border border-border bg-card p-8 flex flex-col items-center gap-5 text-center">
				<div className="rounded-full bg-destructive/10 p-3">
					<AlertTriangle
						size={22}
						strokeWidth={1.75}
						className="text-destructive"
					/>
				</div>
				<div className="space-y-1.5">
					<h1
						data-testid="error-screen-title"
						className="text-base font-semibold text-foreground"
					>
						Something went wrong
					</h1>
					{error?.message && (
						<p
							data-testid="error-screen-message"
							className="text-xs text-muted-foreground leading-relaxed"
						>
							{error.message}
						</p>
					)}
				</div>
				{onReset && (
					<button
						type="button"
						data-testid="error-screen-reset"
						onClick={onReset}
						className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
					>
						<RotateCcw size={12} strokeWidth={2.5} />
						Try again
					</button>
				)}
			</div>
		</div>
	)
}

interface ErrorBoundaryState {
	error: Error | null
}

interface ErrorBoundaryProps {
	children: ReactNode
}

export class ErrorBoundary extends Component<
	ErrorBoundaryProps,
	ErrorBoundaryState
> {
	state: ErrorBoundaryState = { error: null }

	static getDerivedStateFromError(error: Error): ErrorBoundaryState {
		return { error }
	}

	componentDidCatch(error: Error, info: ErrorInfo) {
		console.error('Uncaught error:', error, info)
	}

	reset = () => this.setState({ error: null })

	render() {
		if (this.state.error) {
			return <ErrorScreen error={this.state.error} onReset={this.reset} />
		}
		return this.props.children
	}
}
