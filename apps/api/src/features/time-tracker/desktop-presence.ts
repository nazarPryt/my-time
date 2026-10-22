import {
	DESKTOP_PRESENCE_CHANNEL,
	desktopPresenceRepository,
} from './desktop-presence-repository'
import { createUserChangeListener } from './user-change-listener'

const listener = createUserChangeListener(DESKTOP_PRESENCE_CHANNEL)
export const startDesktopPresenceListener = listener.start
export const subscribeDesktopPresence = listener.subscribe
export const desktopPresenceService = desktopPresenceRepository
