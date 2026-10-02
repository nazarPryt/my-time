import { zodResolver } from '@hookform/resolvers/zod'
import {
	type CreateBlockedSiteRequest,
	CreateBlockedSiteRequestSchema,
} from 'contracts'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import {
	ExtensionSetupCard,
	ExtensionStatusBadge,
	ExtensionUpdateCard,
	SiteList,
	useExtensionConnection,
	useSiteBlockingActions,
	useSiteBlockingState,
} from '@/features/site-blocking'
import { SITE_BLOCKING_TEST_IDS as SB } from '@/features/site-blocking/testIds'
import { Button, Input } from '@/shared/ui'

export function SiteBlockingPage() {
	const { sites, loading, submitting, error } = useSiteBlockingState()
	const { loadSites, addSite, removeSite } = useSiteBlockingActions()
	const extension = useExtensionConnection()
	const showSetup =
		extension.status === 'not-installed' || extension.status === 'not-linked'
	// Setup comes first: an update only matters once the extension is working.
	const showUpdate = !showSetup && extension.updateAvailable

	const { register, handleSubmit, reset } = useForm<CreateBlockedSiteRequest>({
		resolver: zodResolver(CreateBlockedSiteRequestSchema),
		defaultValues: { domain: '' },
	})

	useEffect(() => {
		void loadSites()
	}, [loadSites])

	async function handleAdd({ domain }: CreateBlockedSiteRequest) {
		await addSite(domain)
		reset()
	}

	return (
		<div className="h-full flex flex-col" data-testid={SB.page}>
			<header className="h-14 flex items-center justify-between px-4 sm:px-8 border-b border-border shrink-0">
				<h1 className="text-sm font-semibold text-foreground">Site Blocking</h1>
				<ExtensionStatusBadge
					status={extension.status}
					updateAvailable={extension.updateAvailable}
				/>
			</header>

			<div className="flex-1 overflow-auto p-4 sm:p-8">
				<div className="max-w-lg mx-auto space-y-6">
					{showSetup && (
						<ExtensionSetupCard
							status={extension.status}
							connecting={extension.connecting}
							connectFailed={extension.connectFailed}
							onConnect={extension.connect}
						/>
					)}
					{showUpdate && (
						<ExtensionUpdateCard
							installedVersion={extension.installedVersion}
							latestVersion={extension.latestVersion}
						/>
					)}

					<form
						onSubmit={handleSubmit(handleAdd)}
						className="flex gap-2"
						data-testid={SB.addForm}
					>
						<Input
							placeholder="e.g. reddit.com"
							{...register('domain')}
							disabled={submitting}
							className="flex-1"
							data-testid={SB.domainInput}
						/>
						<Button type="submit" disabled={submitting} data-testid={SB.addBtn}>
							Block
						</Button>
					</form>

					{error && (
						<p className="text-sm text-destructive" data-testid={SB.error}>
							{error}
						</p>
					)}

					<div className="rounded-xl border border-border bg-card overflow-hidden">
						<SiteList sites={sites} loading={loading} onRemove={removeSite} />
					</div>
				</div>
			</div>
		</div>
	)
}
