import { safeParse } from 'valibot'
import { sql } from 'kysely'
import { db } from '../database'

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  const { user } = session

  if (!user?.id) {
    throw createError({
      statusCode: 401,
      statusMessage: 'errors.network.notAuthorized',
      message: JSON.stringify(session)
    })
  } else {
    const { success, output, issues } = await readValidatedBody(event, body => safeParse(SubtaskBodyArraySchema, body))
    if (!success) {
      // TODO: write a util that wraps readValidatedBody / createError.
      throw createError({
	statusCode: 400,
	statusMessage: 'Invalid Request',
	message: { issues }
      })
    } else {
      const updates = output.map(st => ({ ...st, user_id: user.id })) as NewSubtask[]
      const keys = Object.keys(output[0]) as (keyof UpdateSubtask)[]
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
    }
  }
})
