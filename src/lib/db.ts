import pg from 'pg'

const { Pool } = pg


const globalForPg = globalThis as typeof globalThis & {
  pgPool?: pg.Pool
}

export function createPgConnectionPool() {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not set')
  }
  return new Pool({
    connectionString: connectionString,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });
}

export function getPgConnectionPool() {
  if (!globalForPg.pgPool) {
    globalForPg.pgPool = createPgConnectionPool()
  }
  return globalForPg.pgPool
} 