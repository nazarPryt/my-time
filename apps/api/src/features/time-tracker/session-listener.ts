import { SESSION_EVENTS_CHANNEL } from './session-notifications'
import { createUserChangeListener } from './user-change-listener'

const listener = createUserChangeListener(SESSION_EVENTS_CHANNEL)
export const startSessionListener = listener.start
export const subscribeSessionChanges = listener.subscribe
