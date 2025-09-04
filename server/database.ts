import type { Database } from '../shared/types/database'
import * as pg from 'pg'
import { Kysely, PostgresDialect } from 'kysely'
import { Temporal } from '@js-temporal/polyfill'

// This allow a custom mapping at the driver layer to and from Temporal.
// https://www.kysely.dev/docs/recipes/data-types
pg.types.setTypeParser(pg.types.builtins.TIMESTAMPTZ, (val) => {
  return Temporal.Instant.from(val)
})

export const dialect = new PostgresDialect({
  pool: new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    max: 5
  })
})

export const db = new Kysely<Database>({
  dialect
  // , log: ['query', 'error']
})
