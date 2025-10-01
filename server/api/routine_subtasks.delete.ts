import { sql } from 'kysely'
import { db } from '../database'
import { archive_routine_subtask } from '@@/shared/types/database/table_functions'

export default defineEventHandler(async (event) => {
  const { user, query } = await requireUserAndValidatedQuery(event, ArchiveRoutineSubtaskSchema)

  return await db
    .selectFrom(archive_routine_subtask(user.id, query.archive_routine_subtask_id))
    .select(['routine_subtask_id', 'updated_order', 'updated_archived_at'])
    .execute()
})
