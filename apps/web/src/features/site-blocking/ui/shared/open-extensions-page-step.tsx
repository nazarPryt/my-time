import type { ReactNode } from 'react'
import { CHROME_EXTENSIONS_PAGE } from '../../config/extension'
import { CopyableUrl } from './copyable-url'

/** "Open chrome://extensions …" — the step every install/update guide shares. */
export function OpenExtensionsPageStep({ children }: { children?: ReactNode }) {
	return (
		<li>
			Open <CopyableUrl url={CHROME_EXTENSIONS_PAGE} />
			{children ?? ' in a new tab.'}
		</li>
	)
}
