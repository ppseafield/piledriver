import { sql } from 'kysely'
import { db } from '../database'

export default defineEventHandler(async (event) => {
  const { user, body } = await requireUserAndValidatedBody(event, RoutineSubtaskArraySchema)

  const updated_at = nowTemporal()
  const newRoutineSubtasks = body.map(rst => ({
    ...rst,
    updated_at,
    user_id: user.id
  })) as NewRoutineSubtask[]

  return await db
    .insertInto('routine_subtasks')
    .values(newRoutineSubtasks)
    .returningAll()
    .execute()
})
