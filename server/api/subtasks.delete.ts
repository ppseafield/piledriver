import { sql } from 'kysely'
import { db } from '../database'

export default defineEventHandler(async (event) => {
  const { user, query } = await requireUserAndValidatedQuery(event, ArchiveSubtaskSchema)
  const results = await sql<ArchiveSubtaskResult[]>`SELECT subtask_id, updated_order, updated_archived_at FROM public.archive_subtask(${user.id}, ${query.archive_subtask_id});`
    .execute(db)
  
  return results.rows
})
