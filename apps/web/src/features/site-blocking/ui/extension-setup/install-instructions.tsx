import { ExternalLinkIcon } from 'lucide-react'
import { WEB_CONFIG } from '@/shared/config/web-config'
import { Button } from '@/shared/ui'
import { SITE_BLOCKING_TEST_IDS as SB } from '../../testIds'
import { DownloadExtensionButton } from '../shared/download-extension-button'
import { InstructionList, UiLabel } from '../shared/instruction-list'
import { OpenExtensionsPageStep } from '../shared/open-extensions-page-step'
import { ReloadHint } from './reload-hint'

/** Step 1 body: the Web Store button once published, the manual zip guide until then. */
export function InstallInstructions() {
	return (
		<div className="space-y-3">
			{WEB_CONFIG.EXTENSION_STORE_URL ? <StoreInstall /> : <ZipInstall />}
			<ReloadHint />
		</div>
	)
}

function StoreInstall() {
	return (
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
	)
}

function ZipInstall() {
	return (
		<>
			<DownloadExtensionButton testId={SB.downloadLink}>
				Download extension (.zip)
			</DownloadExtensionButton>
			<InstructionList>
				<li>Unzip the downloaded file.</li>
				<OpenExtensionsPageStep />
				<li>
					Turn on <UiLabel>Developer mode</UiLabel> (top-right corner).
				</li>
				<li>
					Click <UiLabel>Load unpacked</UiLabel> and select the unzipped folder.
				</li>
			</InstructionList>
		</>
	)
}
