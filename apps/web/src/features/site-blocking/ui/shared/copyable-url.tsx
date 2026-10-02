import { CheckIcon, CopyIcon } from 'lucide-react'
import { useCopyToClipboard } from '../../model/use-copy-to-clipboard'
import { SITE_BLOCKING_TEST_IDS as SB } from '../../testIds'

/** An address chip that copies itself — for URLs a website can't link to. */
export function CopyableUrl({ url }: { url: string }) {
	const { copied, copy } = useCopyToClipboard()

	return (
		<button
			type="button"
			onClick={() => copy(url)}
			data-testid={SB.copyableUrl}
			className="inline-flex items-center gap-1 rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground hover:bg-muted/70"
		>
			{url}
			{copied ? (
				<CheckIcon className="size-3" data-testid={SB.copyableUrlCopied} />
			) : (
				<CopyIcon className="size-3" />
			)}
		</button>
	)
}
