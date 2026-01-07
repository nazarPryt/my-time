import { drizzle } from 'drizzle-orm/node-postgres'
import pkg from 'pg'
const { Pool } = pkg
import * as schema from './schemas'

/**
 * Database Configuration
 */
const DATABASE_URL = import.meta.env.VITE_DATABASE_URL || process.env.DATABASE_URL

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set')
}

/**
 * PostgreSQL Connection Pool
 * Configured for optimal performance with Supabase
 */
export const pool = new Pool({
  connectionString: DATABASE_URL,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 5000, // Return error after 5 seconds if connection could not be established
  ssl:
    DATABASE_URL.includes('supabase.co') || process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: false }
      : undefined,
})

/**
 * Drizzle Database Instance
 * Provides type-safe query builder and ORM functionality
 */
export const db = drizzle(pool, { schema })

/**
 * Test database connection
 */
export async function testConnection(): Promise<boolean> {
  try {
    const client = await pool.connect()
    await client.query('SELECT NOW()')
    client.release()
    console.log('✅ Database connection successful')
    return true
  } catch (error) {
    console.error('❌ Database connection failed:', error)
    return false
  }
}

/**
 * Close database connection pool
 * Should be called when application shuts down
 */
export async function closeConnection(): Promise<void> {
  await pool.end()
  console.log('Database connection pool closed')
}

/**
 * Get a client from the pool for transactions
 */
export async function getClient() {
  return pool.connect()
}
