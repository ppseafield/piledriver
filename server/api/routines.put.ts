import { db } from '../database'
import type { NewRoutine, UpdateRoutine } from '@@/shared/types/database/routines'

export default defineEventHandler(async (event) => {
  const { user, body } = await requireUserAndValidatedBody(event, TaskBodyArraySchema)

  const updates = body.map(t => ({ ...t, user_id: user.id })) as NewTask[]
  const keys = Object.keys(body[0]) as (keyof UpdateTask)[]

  return await db
    .insertInto('routines')
    .values(updates)
    .returningAll()
    .onConflict((oc) =>
      oc
	.column('id')
	.doUpdateSet((eb) => Object.fromEntries(keys.map((key) => [key, eb.ref(`excluded.${key}`)])))
	.where('routines.user_id', '=', user.id)
	       )
    .execute()
})
