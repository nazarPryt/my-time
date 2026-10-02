import { InstructionList, UiLabel } from '../shared/instruction-list'
import { OpenExtensionsPageStep } from '../shared/open-extensions-page-step'

// Store installs auto-update; these steps just skip Chrome's hours-long wait.
export function StoreUpdateSteps() {
	return (
		<InstructionList>
			<OpenExtensionsPageStep />
			<li>
				Turn on <UiLabel>Developer mode</UiLabel> (top-right corner) and click{' '}
				<UiLabel>Update</UiLabel>.
			</li>
		</InstructionList>
	)
}
