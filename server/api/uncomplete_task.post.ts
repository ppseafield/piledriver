import { sql } from 'kysely'
import { db } from '../database'
import { UncompleteTaskRequestSchema } from '@@/shared/types/tasks'

export default defineEventHandler(async (event) => {
  const { user, body } = await requireUserAndValidatedBody(event, UncompleteTaskRequestSchema)

  return await db
    .updateTable('tasks')
    .set(({ eb }) => ({
      completed_at: null,
      task_order: eb
        .selectFrom('tasks')
        .select(
          sql<number>`COALESCE(MAX(task_order), 0) + 1`.as('task_order')
        )
        .where('user_id', '=', user.id)
        .limit(1)
    }))
    .where('id', '=', body.task_id)
    .where('user_id', '=', sql<string>`${user.id}`)
    .returning(['id', 'task_order', 'completed_at'])
    .executeTakeFirst()
})
