import { db } from '../database'
import type { NewTask, UpdateTask } from '../../shared/types/database/tasks'

export default defineEventHandler(async (event) => {
  const { user, body } = await requireUserAndValidatedBody(event, TaskBodyArraySchema)

  const updates = body.map(t => ({ ...t, user_id: user.id })) as NewTask[]
  const keys = Object.keys(body[0]) as (keyof UpdateTask)[]
  // Either we send n UPDATE statements or we send one INSERT .. ON CONFLICT UPDATE SET
  // TODO: Reevaluate whether to accept one object or n objects in post/put handlers.
  return await db
    .insertInto('tasks')
    .values(updates)
    .returningAll()
    .onConflict((oc) =>
      oc
	.column('id')
	.doUpdateSet((eb) => Object.fromEntries(keys.map((key) => [key, eb.ref(`excluded.${key}`)])))
	.where('tasks.user_id', '=', user.id)
               )
    .executeTakeFirst() // TODO: take first??????
})
