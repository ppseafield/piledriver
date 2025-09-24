import { sql } from 'kysely'
import { db } from '../database'

export default defineEventHandler(async (event) => {
  const { user, body } = await requireUserAndValidatedBody(event, SubtaskBodyArraySchema)

  const updates = body.map(st => ({ ...st, user_id: user.id })) as NewSubtask[]
  const keys = Object.keys(body[0]).filter(k => k !== 'id' && k !== 'user_id') as (keyof UpdateSubtask)[]
  const updated_at = nowTemporal()
  // TODO: Reevaluate whether to accept one object or n objects in post/put handlers.
  return await db
    .insertInto('task_subtasks')
    .values(updates)
    .returningAll()
    .onConflict((oc) =>
      oc
	.column('id')
	.doUpdateSet((eb) => Object.fromEntries(keys.map((key) => [key, eb.ref(`excluded.${key}`)])))
	.where('task_subtasks.user_id', '=', user.id)
	       )
    .execute()
})
