import { extensionCardFor } from '../lib/extension-status'
import { useExtensionConnection } from '../model/use-extension-connection'
import { ExtensionSetupCard } from './extension-setup/extension-setup-card'
import { ExtensionUpdateCard } from './extension-update/extension-update-card'

/** The setup guide or the update prompt — whichever the extension needs, if any. */
export function ExtensionPanel() {
	const extension = useExtensionConnection()
	const card = extensionCardFor(extension.status, extension.updateAvailable)

	if (card === 'setup') {
		return (
			<ExtensionSetupCard
				status={extension.status}
				connecting={extension.connecting}
				connectFailed={extension.connectFailed}
				onConnect={extension.connect}
			/>
		)
	}
	if (card === 'update') {
		return (
			<ExtensionUpdateCard
				installedVersion={extension.installedVersion}
				latestVersion={extension.latestVersion}
			/>
		)
	}
	return null
}
