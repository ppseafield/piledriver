import { sql } from 'kysely'
import { db } from '../database'

export default defineEventHandler(async (event) => {
  const { user, body } = await requireUserAndValidatedBody(event, SubtaskBodyArraySchema)

  const updated_at = nowTemporal()
  const updates = body.map(st => ({
    ...st,
    updated_at,
    user_id: user.id
  })) as NewRoutineSubtask[]

  const keys = Object.keys(body[0]).filter(k => k !== 'id' && k !== 'user_id') as (keyof UpdateSubtask)[]

  return await db
    .insertInto('routine_subtasks')
    .values(updates)
    .returningAll()
    .onConflict((oc) =>
      oc
	.column('id')
	.doUpdateSet((eb) => Object.fromEntries(keys.map((key) => [key, eb.ref(`excluded.${key}`)])))
	.where('routine_subtasks.user_id', '=', user.id)
    )
    .execute()
})
