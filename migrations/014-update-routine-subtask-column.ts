/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Kysely } from 'kysely'
import { sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  // This might have been 'dropConstraint()' if I had names the not null constraint?
  await sql`ALTER TABLE routine_subtasks ALTER COLUMN task_order DROP NOT NULL;`.execute(db)
}

export async function down(db: Kysely<any>): Promise<void> {
  
}
