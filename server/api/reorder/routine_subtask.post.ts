import { sql } from 'kysely'
import { db } from '@@/server/database'
import { ReorderRoutineSubtaskRequestSchema } from '@@/shared/types/routine_subtasks'
import { reorder_routine_subtask } from '@@/shared/types/database/table_functions'

export default defineEventHandler(async (event) => {
  const { user, body } = await requireUserAndValidatedBody(event, ReorderRoutineSubtaskRequestSchema)

  return await db
    .selectFrom(reorder_routine_subtask(user.id, body.move_routine_subtask_id, body.move_new_order))
    .select(['routine_subtask_id', 'updated_order'])
    .execute()
})
