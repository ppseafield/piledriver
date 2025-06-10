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
    return await db
      .selectFrom('tasks')
      .selectAll()
      .where('user_id', '=', sql<string>`${user.id}`)
      .where((eb) => eb.or([
	eb('completed_at', 'is', null),
	eb('completed_at', '>=', sql`now() - interval '2 weeks'`)
      ]))
      .orderBy('task_order')
      .orderBy('completed_at')
      .execute()
  }
})

