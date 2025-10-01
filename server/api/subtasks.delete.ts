import { sql } from 'kysely'
import { db } from '../database'
import { archive_subtask } from '@@/shared/types/database/table_functions'

export default defineEventHandler(async (event) => {
  const { user, query } = await requireUserAndValidatedQuery(event, ArchiveSubtaskSchema)

  return await db
    .selectFrom(archive_subtask(user.id, query.archive_subtask_id))
    .select(['subtask_id', 'updated_order', 'updated_archived_at'])
    .execute()
})
