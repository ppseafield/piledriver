import { sql } from 'kysely'
import { db } from '../database'

export default defineEventHandler(async (event) => {
  const { user, body } = await requireUserAndValidatedBody(event, SubtaskBodyArraySchema)

  const updated_at = nowTemporal()
  const newSubtasks = body.map(st => ({
    ...st,
    updated_at,
    user_id: user.id
  })) as NewSubtask[]

  return await db
    .insertInto('task_subtasks')
    .values(newSubtasks)
    .returningAll()
    .execute()
})
