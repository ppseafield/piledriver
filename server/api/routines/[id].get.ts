import { sql } from 'kysely'
import { db } from '@@/server/database'

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)

  const routine = await db
    .selectFrom('routines')
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

})
