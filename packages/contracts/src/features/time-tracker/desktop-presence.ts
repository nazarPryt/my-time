import { z } from 'zod'

export const DESKTOP_PRESENCE_EVENT = 'desktop-presence' as const
export const DesktopPresenceSchema = z.object({ connected: z.boolean() })
export type DesktopPresence = z.infer<typeof DesktopPresenceSchema>
