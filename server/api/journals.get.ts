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
      .selectFrom('journals')
      .selectAll()
      .where('user_id', '=', user.id)
      .orderBy('created_at', 'desc')
      .execute()
  }
})
