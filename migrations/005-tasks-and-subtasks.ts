/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Kysely } from 'kysely'
import { sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('tasks')
    .addColumn('id', 'uuid', (col) => col.primaryKey().notNull().defaultTo(sql`gen_random_uuid()`))
    .addColumn('user_id', 'uuid', (col) => col.notNull().references('pd_users.id').onDelete('cascade'))
    .addColumn('routine_from', 'uuid', (col) => col.references('routines.id').onDelete('cascade'))
    .addColumn('journaled_by', 'uuid', (col) => col.references('journals.id').onDelete('restrict'))
    .addColumn('created_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`now()`))
    .addColumn('updated_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`now()`))
    .addColumn('completed_at', 'timestamptz')
    .addColumn('archived_at', 'timestamptz')
    .addColumn('task_order', 'integer')
    .addColumn('title', 'text', (col) => col.notNull())
    .execute()

  await db.schema
    .createIndex('idx_tasks_user_id_journaled_by')
    .on('tasks')
    .columns(['user_id', 'journaled_by'])
    .execute()

  await db.schema
    .createTable('task_subtasks')
    .addColumn('id', 'uuid', (col) => col.primaryKey().notNull().defaultTo(sql`gen_random_uuid()`))
    .addColumn('user_id', 'uuid', (col) => col.notNull().references('pd_users.id').onDelete('cascade'))
    .addColumn('task_id', 'uuid', (col) => col.notNull().references('tasks.id').onDelete('cascade'))
    .addColumn('parent_subtask_id', 'uuid', (col) => col.references('task_subtasks.id').onDelete('cascade'))
    .addColumn('created_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`now()`))
    .addColumn('updated_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`now()`))
    .addColumn('completed_at', 'timestamptz')
    .addColumn('archived_at', 'timestamptz')
    .addColumn('task_order', 'integer', (col) => col.notNull())
    .addColumn('title', 'text', (col) => col.notNull())
    .execute()

  await db.schema
    .createIndex('idx_task_subtasks_task_id_parent_subtask_id')
    .on('task_subtasks')
    .columns(['user_id', 'task_id', 'parent_subtask_id'])
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .dropIndex('idx_task_subtasks_task_id_parent_subtask_id')
    .execute()

  await db.schema
    .dropTable('task_subtasks')
    .execute()

  await db.schema
    .dropIndex('idx_task_user_id_journaled_by')
    .execute()

  await db.schema
    .dropTable('tasks')
    .execute()
}
