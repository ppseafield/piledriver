
import { sql } from 'kysely'
import { db } from '../database'

export default defineEventHandler(async (event) => {
  const { user, body } = await requireUserAndValidatedBody(event, TaskBodyArraySchema)

  const newTasks = body.map(t => ({ ...t, user_id: user.id })) as NewTask[]
  const updated_at = nowTemporal()
  return await db
    .insertInto('tasks')
    .values(newTasks)
    .returningAll()
    .execute()
})
