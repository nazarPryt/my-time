import {
	CheckIcon,
	DownloadIcon,
	ExternalLinkIcon,
	RotateCwIcon,
} from 'lucide-react'
import type { ReactNode } from 'react'
import { WEB_CONFIG } from '@/shared/config/web-config'
import { cn } from '@/shared/lib/cn'
import {
	Button,
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/shared/ui'
import { extensionDownloadUrl } from '../lib/extension-download-url'
import type { ExtensionStatus } from '../model/use-extension-connection'
import { SITE_BLOCKING_TEST_IDS as SB } from '../testIds'
import { CHROME_EXTENSIONS_PAGE, CopyableUrl } from './copyable-url'

interface ExtensionSetupCardProps {
	status: ExtensionStatus
	connecting: boolean
	connectFailed: boolean
	onConnect: () => void
}

export function ExtensionSetupCard({
	status,
	connecting,
	connectFailed,
	onConnect,
}: ExtensionSetupCardProps) {
	const installed = status === 'not-linked' || status === 'linked'

	return (
		<Card data-testid={SB.setupCard}>
			<CardHeader>
				<CardTitle>Set up site blocking</CardTitle>
				<CardDescription>
					Blocking runs inside your browser through the my·time extension. Your
					list below is saved either way — it starts working once both steps are
					done.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<ol className="space-y-5">
					<Step
						number={1}
						done={installed}
						title="Install the extension"
						testId={SB.installStep}
					>
						{!installed && <InstallInstructions />}
					</Step>
					<Step
						number={2}
						done={status === 'linked'}
						disabled={!installed}
						title="Connect it to your account"
						testId={SB.connectStep}
					>
						{installed && (
							<div className="space-y-2">
								<p className="text-muted-foreground">
									Signs the extension in as you, so it syncs your block list.
								</p>
								<Button
									size="sm"
									onClick={onConnect}
									disabled={connecting}
									data-testid={SB.connectBtn}
								>
									{connecting ? 'Connecting…' : 'Connect extension'}
								</Button>
								{connectFailed && (
									<p className="text-destructive" data-testid={SB.connectError}>
										Couldn't connect. Reload this page and try again.
									</p>
								)}
							</div>
						)}
					</Step>
				</ol>
			</CardContent>
		</Card>
	)
}

function Step({
	number,
	title,
	done,
	disabled = false,
	testId,
	children,
}: {
	number: number
	title: string
	testId: string
	done: boolean
	disabled?: boolean
	children?: ReactNode
}) {
	return (
		<li
			className={cn('flex gap-3', disabled && 'opacity-50')}
			data-testid={testId}
			data-disabled={disabled || undefined}
		>
			<span
				className={cn(
					'mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border text-xs font-medium',
					done
						? 'border-green-500 bg-green-500/10 text-green-500'
						: 'border-border text-muted-foreground',
				)}
			>
				{done ? <CheckIcon className="size-3.5" /> : number}
			</span>
			<div className="flex-1 space-y-2">
				<p className="font-medium text-foreground">
					{title}
					{done && (
						<span
							className="ml-2 text-xs font-normal text-green-500"
							data-testid={SB.stepDone}
						>
							Done
						</span>
					)}
				</p>
				{children}
			</div>
		</li>
	)
}

function InstallInstructions() {
	if (WEB_CONFIG.EXTENSION_STORE_URL) {
		return (
			<div className="space-y-2">
				<Button size="sm" asChild>
					<a
						href={WEB_CONFIG.EXTENSION_STORE_URL}
						target="_blank"
						rel="noreferrer"
						data-testid={SB.storeLink}
					>
						<ExternalLinkIcon />
						Add to Chrome
					</a>
				</Button>
				<ReloadHint />
			</div>
		)
	}

	return (
		<div className="space-y-3">
			<Button size="sm" asChild>
				<a href={extensionDownloadUrl()} download data-testid={SB.downloadLink}>
					<DownloadIcon />
					Download extension (.zip)
				</a>
			</Button>
			<ol className="list-decimal space-y-1.5 pl-5 text-muted-foreground marker:text-muted-foreground/60">
				<li>Unzip the downloaded file.</li>
				<li>
					Open <CopyableUrl url={CHROME_EXTENSIONS_PAGE} /> in a new tab.
				</li>
				<li>
					Turn on <strong className="text-foreground">Developer mode</strong>{' '}
					(top-right corner).
				</li>
				<li>
					Click <strong className="text-foreground">Load unpacked</strong> and
					select the unzipped folder.
				</li>
			</ol>
			<ReloadHint />
		</div>
	)
}

// Chrome doesn't inject content scripts into tabs that were open before the
// install, so this tab can't detect the extension until it's reloaded.
function ReloadHint() {
	return (
		<p className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
			Already installed?
			<Button
				variant="link"
				size="xs"
				className="h-auto px-0"
				onClick={() => window.location.reload()}
				data-testid={SB.reloadBtn}
			>
				<RotateCwIcon />
				Reload this page
			</Button>
		</p>
	)
}
