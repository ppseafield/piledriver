import { sql } from 'kysely'
import { db } from '@@/server/database'
import type { ReorderTaskResult } from '@@/shared/types/subtasks'
import { ReorderSubtaskRequestSchema } from '@@/shared/types/subtasks'
import { reorder_subtask } from '@@/shared/types/database/table_functions'

export default defineEventHandler(async (event) => {
  const { user, body } = await requireUserAndValidatedBody(event, ReorderSubtaskRequestSchema)

  return await db
    .selectFrom(reorder_subtask(user.id, body.move_subtask_id, body.move_new_order))
    .select(['subtask_id', 'updated_order'])
    .execute()
})
