/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Kysely } from 'kysely'
import { sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('pd_passwords')
    .addColumn('user_id', 'uuid', (col) => col.notNull().references('pd_users.id').onDelete('cascade'))
    .addColumn('password_hash', 'text', (col) => col.notNull())
    .execute()

  await db.schema
    .createIndex('idx_pd_passwords_user_id')
    .on('pd_passwords')
    .column('user_id')
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .dropIndex('idx_pd_passwords_user_id')
    .execute()

  await db.schema
    .dropTable('pd_passwords')
    .execute()
}
