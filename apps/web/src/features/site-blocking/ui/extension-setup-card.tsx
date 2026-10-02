import {
	CheckIcon,
	CopyIcon,
	DownloadIcon,
	ExternalLinkIcon,
	RotateCwIcon,
} from 'lucide-react'
import { type ReactNode, useState } from 'react'
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
import type { ExtensionStatus } from '../model/use-extension-connection'

const EXTENSIONS_PAGE = 'chrome://extensions'

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
		<Card>
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
					<Step number={1} done={installed} title="Install the extension">
						{!installed && <InstallInstructions />}
					</Step>
					<Step
						number={2}
						done={status === 'linked'}
						disabled={!installed}
						title="Connect it to your account"
					>
						{installed && (
							<div className="space-y-2">
								<p className="text-muted-foreground">
									Signs the extension in as you, so it syncs your block list.
								</p>
								<Button size="sm" onClick={onConnect} disabled={connecting}>
									{connecting ? 'Connecting…' : 'Connect extension'}
								</Button>
								{connectFailed && (
									<p className="text-destructive">
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
	children,
}: {
	number: number
	title: string
	done: boolean
	disabled?: boolean
	children?: ReactNode
}) {
	return (
		<li className={cn('flex gap-3', disabled && 'opacity-50')}>
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
						<span className="ml-2 text-xs font-normal text-green-500">
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
				<a href={WEB_CONFIG.EXTENSION_DOWNLOAD_URL} download>
					<DownloadIcon />
					Download extension (.zip)
				</a>
			</Button>
			<ol className="list-decimal space-y-1.5 pl-5 text-muted-foreground marker:text-muted-foreground/60">
				<li>Unzip the downloaded file.</li>
				<li>
					Open <CopyableUrl url={EXTENSIONS_PAGE} /> in a new tab.
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

// Browsers block links to chrome:// pages from websites, so the user has to
// paste the address themselves — a copy button makes that painless.
function CopyableUrl({ url }: { url: string }) {
	const [copied, setCopied] = useState(false)

	async function copy() {
		await navigator.clipboard.writeText(url)
		setCopied(true)
		setTimeout(() => setCopied(false), 1500)
	}

	return (
		<button
			type="button"
			onClick={copy}
			className="inline-flex items-center gap-1 rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground hover:bg-muted/70"
		>
			{url}
			{copied ? (
				<CheckIcon className="size-3" />
			) : (
				<CopyIcon className="size-3" />
			)}
		</button>
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
			>
				<RotateCwIcon />
				Reload this page
			</Button>
		</p>
	)
}
