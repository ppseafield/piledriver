/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Kysely } from 'kysely'
import { sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('projects')
    .addColumn('id', 'uuid', (col) => col.primaryKey().notNull().defaultTo(sql`gen_random_uuid()`))
    .addColumn('user_id', 'uuid', (col) => col.notNull().references('pd_users.id').onDelete('cascade'))
    .addColumn('created_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`now()`))
    .addColumn('updated_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`now()`))
    .addColumn('archived_at', 'timestamptz')
    .addColumn('title', 'text', (col) => col.notNull())
    .addColumn('description', 'text')
    .execute()

  await db.schema
    .createIndex('idx_projects_user_id')
    .on('routines')
    .columns(['user_id'])
    .execute()

  await db.schema
    .alterTable('tasks')
    .addColumn('project_id', 'uuid', (col) => col.references('projects.id').onDelete('cascade').defaultTo(null))
    .addColumn('project_assigned', 'timestamptz')
    .execute()

  await db.schema
    .createIndex('idx_task_project')
    .on('tasks')
    .columns(['project_id', 'project_assigned'])
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .dropIndex('idx_task_project')
    .execute()

  await db.schema
    .alterTable('tasks')
    .dropColumn('project_assigned')
    .dropColumn('project_id')
    .execute()

  await db.schema
    .dropTable('projects')
    .execute()
}
