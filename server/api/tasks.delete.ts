import { sql } from 'kysely'
import { db } from '../database'

export default defineEventHandler(async (event) => {
  const { user, query } = await requireUserAndValidatedQuery(event, ArchiveTaskSchema)

  const results = await sql<CompleteTaskResult[]>`SELECT task_id, updated_order, updated_archived_at FROM public.archive_task(${user.id}, ${query.archive_task_id});`
    .execute(db)
  return results.rows
})
