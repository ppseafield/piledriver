/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Kysely } from 'kysely'
import { sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await sql`ALTER TABLE routine_subtasks ALTER COLUMN task_order DROP NOT NULL;`.execute(db)
}

export async function down(db: Kysely<any>): Promise<void> {
  
}
