import * as v from 'valibot'
import { sql } from 'kysely'
import { db } from '../database'
import { UncompleteTaskRequestSchema } from '@@/shared/types/tasks'

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  const { user } = session

  if (!user?.id) {
    throw createError({
      statusCode: 401,
      statusMessage: 'errors.network.notAuthorized',
      message: JSON.stringify(session)
    })
  } else {
    const { success, output, issues } = await readValidatedBody(event, body => v.safeParse(UncompleteTaskRequestSchema, body))
    if (!success) {
      // TODO: write a util that wraps readValidatedBody / createError.
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid Request',
        message: JSON.stringify({ issues })
      })
    } else {
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
        .where('id', '=', output.task_id)
        .where('user_id', '=', sql<string>`${user.id}`)
        .returning(['id', 'task_order', 'completed_at'])
        .executeTakeFirst()
    }
  }
})
