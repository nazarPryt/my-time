import type { ReactNode } from 'react'

export interface FormPanelProps {
	children: ReactNode
	title: string
	description: string
	footer: ReactNode
}

export function FormPanel({
	children,
	title,
	description,
	footer,
}: FormPanelProps) {
	return (
		<div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-background">
			<div className="w-full max-w-sm">
				<div className="mb-8">
					<h1 className="text-2xl font-semibold tracking-tight text-foreground">
						{title}
					</h1>
					<p className="mt-1.5 text-sm text-muted-foreground">{description}</p>
				</div>
				<div>{children}</div>
				<div className="mt-6 text-center text-sm text-muted-foreground">
					{footer}
				</div>
			</div>
		</div>
	)
}
