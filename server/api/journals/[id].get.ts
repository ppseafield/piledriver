import { sql } from 'kysely'
import { db } from '@@/server/database'

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
    const journal = await db
      .selectFrom('journals')
      .selectAll()
      .where('user_id', '=', user.id)
      .orderBy('created_at', 'desc')
      .executeTakeFirstOrThrow()

    const tasks = await db
      .selectFrom('tasks')
      .selectAll()
      .where('user_id', '=', sql<string>`${user.id}`)
      .where('journaled_by', '=', journal.id)
      .orderBy('completed_at')
      .execute()

    return {
      journal,
      tasks
    }
  }
})
