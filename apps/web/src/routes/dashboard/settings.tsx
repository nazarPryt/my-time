import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/settings')({
	component: SettingsPage,
})

function SettingsSection({
	title,
	description,
	children,
}: {
	title: string
	description?: string
	children: React.ReactNode
}) {
	return (
		<section className="py-6 border-b border-border last:border-0">
			<div className="flex gap-8">
				<div className="w-52 shrink-0">
					<h2 className="text-sm font-semibold text-foreground">{title}</h2>
					{description && (
						<p className="mt-1 text-xs text-muted-foreground leading-relaxed">
							{description}
						</p>
					)}
				</div>
				<div className="flex-1 max-w-sm">{children}</div>
			</div>
		</section>
	)
}

function Placeholder({ label }: { label: string }) {
	return (
		<div className="h-9 rounded-md border border-dashed border-border flex items-center px-3">
			<span className="text-xs text-muted-foreground/50">{label}</span>
		</div>
	)
}

function SettingsPage() {
	return (
		<div className="h-full flex flex-col">
			{/* Page header */}
			<header className="h-14 flex items-center px-8 border-b border-border shrink-0">
				<h1 className="text-sm font-semibold text-foreground tracking-tight">
					Settings
				</h1>
			</header>

			{/* Content */}
			<div className="flex-1 overflow-auto px-8 py-2">
				<div className="max-w-2xl">
					<SettingsSection
						title="Profile"
						description="Your name and account details."
					>
						<div className="space-y-2">
							<Placeholder label="Display name" />
							<Placeholder label="Email address" />
						</div>
					</SettingsSection>

					<SettingsSection
						title="Preferences"
						description="Timezone and display options."
					>
						<div className="space-y-2">
							<Placeholder label="Timezone" />
							<Placeholder label="Week starts on" />
						</div>
					</SettingsSection>

					<SettingsSection
						title="Appearance"
						description="Theme and visual options."
					>
						<Placeholder label="Theme (light / dark)" />
					</SettingsSection>
				</div>
			</div>
		</div>
	)
}
