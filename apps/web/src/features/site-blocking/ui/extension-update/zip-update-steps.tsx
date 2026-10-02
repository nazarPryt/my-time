import { SITE_BLOCKING_TEST_IDS as SB } from '../../testIds'
import { DownloadExtensionButton } from '../shared/download-extension-button'
import { InstructionList, UiLabel } from '../shared/instruction-list'
import { OpenExtensionsPageStep } from '../shared/open-extensions-page-step'

export function ZipUpdateSteps({ latestVersion }: { latestVersion: string }) {
	return (
		<div className="space-y-3">
			<DownloadExtensionButton testId={SB.updateDownloadLink}>
				Download v{latestVersion}
			</DownloadExtensionButton>
			<InstructionList>
				<li>
					Unzip it into the <UiLabel>same folder</UiLabel> you installed from,
					replacing the old files.
				</li>
				<OpenExtensionsPageStep>
					{' '}
					and click the ↻ reload icon on <UiLabel>my·time</UiLabel>.
				</OpenExtensionsPageStep>
			</InstructionList>
			<p className="text-xs text-muted-foreground">
				Keep the same folder — Chrome ties the extension (and your connection)
				to its location, so a new folder means connecting again. This page
				refreshes by itself once the update is in.
			</p>
		</div>
	)
}
