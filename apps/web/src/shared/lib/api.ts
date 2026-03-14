import { treaty } from '@elysiajs/eden'
import type { App } from '@my-time/api'
import { WEB_CONFIG } from '@/shared/config/web-config'

export const api = treaty<App>(WEB_CONFIG.API_URL)
