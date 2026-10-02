import { CheckIcon, CopyIcon } from 'lucide-react'
import { useState } from 'react'

export const CHROME_EXTENSIONS_PAGE = 'chrome://extensions'

// Browsers block links to chrome:// pages from websites, so the user has to
// paste the address themselves — a copy button makes that painless.
export function CopyableUrl({ url }: { url: string }) {
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
