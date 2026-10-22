import { useState } from 'react'

/** Detect phones and tablets independently of the browser window width. */
export function useIsMobileDevice() {
	const [isMobileDevice] = useState(() => {
		if (typeof navigator === 'undefined') return false

		const deviceNavigator = navigator as Navigator & {
			userAgentData?: { mobile: boolean; platform: string }
		}
		const { userAgentData, userAgent, maxTouchPoints } = deviceNavigator

		if (userAgentData?.mobile || userAgentData?.platform === 'Android') {
			return true
		}

		if (/Android|iPhone|iPad|iPod|Mobile|Tablet|Silk/i.test(userAgent)) {
			return true
		}

		// iPadOS can report a desktop Mac user agent.
		return /Macintosh/i.test(userAgent) && maxTouchPoints > 1
	})

	return isMobileDevice
}
