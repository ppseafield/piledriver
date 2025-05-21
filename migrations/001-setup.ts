/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Kysely } from 'kysely'
import { sql } from 'kysely'

export async function up(db: Kysely<any>) {
    await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`.execute(db)
    await sql`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`.execute(db)
}

export async function down(db: Kysely<any>) {
    await sql`DROP EXTENSION IF EXISTS "uuid-ossp"`.execute(db)
    await sql`DROP EXTENSION IF EXISTS "pgcrypto"`.execute(db)
}