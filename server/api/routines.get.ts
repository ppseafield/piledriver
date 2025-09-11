import { sql } from 'kysely'
import { db } from '../database'

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  return await db
    .selectFrom('routines')
    .selectAll()
    .where('user_id', '=', user.id)
    .where('archived_at', 'is', null)
    .orderBy('title')
    .execute()
})
