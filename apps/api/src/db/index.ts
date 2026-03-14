import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

import { API_CONFIG } from '@shared/api-config'

const client = postgres(API_CONFIG.DATABASE_URL)

export const db = drizzle(client, { schema })