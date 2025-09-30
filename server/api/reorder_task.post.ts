import { db } from '../database'
import { ReorderTaskRequestSchema } from '@@/shared/types/tasks'
import { reorder_task } from '@@/shared/types/database/table_functions'

export default defineEventHandler(async (event) => {
  const { user, body } = await requireUserAndValidatedBody(event, ReorderTaskRequestSchema)

  return await db
    .selectFrom(reorder_task(user.id, body.move_task_id, body.move_new_order))
    .select(['task_id', 'updated_order'])
    .execute()
})
