/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Kysely } from 'kysely'
import { sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('routines')
    .addColumn('id', 'uuid', (col) => col.primaryKey().notNull().defaultTo(sql`gen_random_uuid()`))
    .addColumn('user_id', 'uuid', (col) => col.notNull().references('pd_users.id').onDelete('cascade'))
    .addColumn('created_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`now()`))
    .addColumn('updated_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`now()`))
    .addColumn('archived_at', 'timestamptz')
    .addColumn('title', 'text', (col) => col.notNull())
    .addColumn('description', 'text')
    .execute()

  await db.schema
    .createIndex('idx_routines_user_id')
    .on('routines')
    .columns(['user_id'])
    .execute()

  await db.schema
    .createTable('routine_subtasks')
    .addColumn('id', 'uuid', (col) => col.primaryKey().notNull().defaultTo(sql`gen_random_uuid()`))
    .addColumn('routine_id', 'uuid', (col) => col.notNull().references('routines.id').onDelete('cascade'))
    .addColumn('user_id', 'uuid', (col) => col.notNull().references('pd_users.id').onDelete('cascade'))
    .addColumn('created_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`now()`))
    .addColumn('updated_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`now()`))
    .addColumn('archived_at', 'timestamptz')
    .addColumn('task_order', 'integer', (col) => col.notNull())
    .addColumn('title', 'text', (col) => col.notNull())
    .execute()

  await db.schema
    .createIndex('idx_routine_subtasks_routine_id')
    .on('routine_subtasks')
    .columns(['routine_id', 'user_id'])
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .dropIndex('idx_routine_subtasks_routine_id')
    .execute()

  await db.schema
    .dropTable('routine_subtasks')
    .execute()

  await db.schema
    .dropIndex('idx_routines_user_id')
    .execute()

  await db.schema
    .dropTable('routines')
    .execute()
}
