import type { Database } from '../shared/types/database'
import { Pool } from 'pg'
import { Kysely, PostgresDialect } from 'kysely'

export const dialect = new PostgresDialect({
  pool: new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 5
  })
})

export const db = new Kysely<Database>({
  dialect
})
