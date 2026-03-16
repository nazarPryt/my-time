import { treaty } from '@elysiajs/eden'
import type { App } from '@my-time/api'
import { WEB_CONFIG } from '@/shared/config/web-config'

const client = treaty<App>(WEB_CONFIG.API_URL)
export const api = client.api.v1
