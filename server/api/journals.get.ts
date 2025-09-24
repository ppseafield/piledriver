import { sql } from 'kysely'
import { db } from '../database'

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)

  return await db
    .selectFrom('journals')
    .selectAll()
    .where('user_id', '=', user.id)
    .orderBy('created_at', 'desc')
    .execute()

})
