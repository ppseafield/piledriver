import { safeParse } from 'valibot'
import { sql } from 'kysely'
import { db } from '../database'

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  const { user } = session

  if (!user?.id) {
    throw createError({
      statusCode: 401,
      statusMessage: 'errors.network.notAuthorized'
    })
  } else {
    // Subtasks we'd like to see on the dashboard for:
    // 1) Tasks that haven't been completed
    // 2) Task that have been completed but haven't been journaled
    // 2a) Tasks that were completed but not journaled
    // 2b) Tasks that were completed more than two weeks ago.
    return await db
      .selectFrom('task_subtasks')
      .selectAll()
      .innerJoin(
	(eb) =>
	  eb.selectFrom('tasks')
	    .select(['id'])
	    .where('user_id', '=', user.id)
	    .where('journaled_by', 'is', null)
	    .where((eb) => eb.or([
	      eb('completed_at', 'is', null),
	      eb('completed_at', '>=', sql`now() - interval '2 weeks'`)
	    ]))
	    .as('tasks'),
	(join) =>
	  join.onRef('task_subtasks.task_id', '=', 'tasks.id'))
      .orderBy('task_id')
      .orderBy('task_order')
      .orderBy('completed_at')
      .execute()
  }
})

