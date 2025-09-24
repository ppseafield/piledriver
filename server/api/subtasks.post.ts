import { sql } from 'kysely'
import { db } from '../database'

export default defineEventHandler(async (event) => {
  const { user, body } = await requireUserAndValidatedBody(event, SubtaskBodyArraySchema)

  const newSubtasks = body.map(st => ({ ...st, user_id: user.id })) as NewSubtask[]
  const updated_at = nowTemporal()
  return await db
    .insertInto('task_subtasks')
    .values(newSubtasks)
    .returningAll()
    .execute()
})
