import { useExtensionConnection } from '../model/use-extension-connection'
import { SITE_BLOCKING_TEST_IDS as SB } from '../testIds'

// Small amber dot for the sidebar nav item, so an outdated extension is
// noticed from any page — not only when the user opens Site Blocking.
export function ExtensionUpdateDot() {
	const { updateAvailable } = useExtensionConnection()
	if (!updateAvailable) return null
	return (
		<span
			className="ml-auto flex items-center"
			title="Extension update available"
			data-testid={SB.updateDot}
		>
			<span aria-hidden="true" className="size-2 rounded-full bg-amber-500" />
			<span className="sr-only">Extension update available</span>
		</span>
	)
}
