import { safeParse } from 'valibot'
import { db } from '../database'
import type { NewTask, UpdateTask } from '../../shared/types/database/tasks'

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
    const { success, output, issues } = await readValidatedBody(event, body => safeParse(TaskBodyArraySchema, body))
    if (!success) {
      // TODO: write a util that wraps readValidatedBody / createError.
      throw createError({
	statusCode: 400,
	statusMessage: 'Invalid Request',
	message: JSON.stringify({ issues })
      })
    } else {
      const updates = output.map(t => ({ ...t, user_id: user.id })) as NewTask[]
      const keys = Object.keys(output[0]) as (keyof UpdateTask)[];
      // Either we send n UPDATE statements or we send one INSERT .. ON CONFLICT UPDATE SET
      return await db
	.insertInto('tasks')
	.values(updates)
	.returningAll()
      	.onConflict((oc) =>
	  oc
	    .column('id')
	    .doUpdateSet((eb) => Object.fromEntries(keys.map((key) => [key, eb.ref(`excluded.${key}`)])))
	    .where('user_id', '=', user.id)
        )
	.executeTakeFirst()
    }
  }
})
