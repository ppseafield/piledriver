import { safeParse } from 'valibot'
import { sql } from 'kysely'
import { db } from '../database'

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
    // Task we'd like to see on the dashboard:
    // 1) Tasks that haven't been completed
    // 2) Task that have been completed but haven't been journaled
    // 2a) Tasks that were completed but not journeld
    // 2b) Tasks that were completed more than two weeks ago.
    return await db
      .selectFrom('tasks')
      .selectAll()
      .where('user_id', '=', sql<string>`${user.id}`)
      .where('journaled_by', 'is', null)
      .where((eb) => eb.or([
	eb('completed_at', 'is', null),
	eb('completed_at', '>=', sql`now() - interval '2 weeks'`)
      ]))
      .orderBy('task_order')
      .orderBy('completed_at')
      .execute()
  }
})

