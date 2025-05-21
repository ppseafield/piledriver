/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Kysely } from 'kysely'
import { sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('pd_users')
    .addColumn('id', 'uuid', (col) => col.primaryKey().notNull().defaultTo(sql`gen_random_uuid()`))
    .addColumn('username', 'text', (col) => col.notNull().unique())
    .addColumn('email', 'text', (col) => col.notNull().unique())
    .addColumn('avatar_url', 'text')
    .addColumn('created_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`now()`))
    .addColumn('updated_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`now()`))
    .addColumn('archived_at', 'timestamptz')
    .addColumn('preferences', 'jsonb')
    .execute()
  
  await db.schema
    .createIndex('idx_users_username')
    .on('pd_users')
    .column('username')
    .execute()
  
  await db.schema
    .createTable('pd_session')
    .addColumn('id', 'uuid', (col) => col.primaryKey().notNull().defaultTo(sql`gen_random_uuid()`))
    .addColumn('user_id', 'uuid', (col) => col.notNull().references('pd_users.id').onDelete('cascade'))
    .addColumn('created_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`now()`))
    .addColumn('expires_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`now() + interval '1 week'`))
    .addColumn('logged_out_at', 'timestamptz')
    .execute()

  await db.schema
      .createIndex('idx_sessions_user_id')
      .on('pd_session')
      .columns(['id', 'user_id'])
      .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('pd_session').execute()
  await db.schema.dropTable('pd_users').execute()
}
