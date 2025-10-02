import { sql } from 'kysely'
import { db } from '../database'
import { archive_task } from '@@/shared/types/database/table_functions'

export default defineEventHandler(async (event) => {
  const { user, query } = await requireUserAndValidatedQuery(event, ArchiveTaskSchema)

  return await db
    .selectFrom(archive_task(user.id, query.archive_task_id))
    .select(['task_id', 'updated_order', 'updated_archived_at'])
    .execute()
})
