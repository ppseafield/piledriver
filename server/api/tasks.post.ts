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
    const { success, output, issues } = await readValidatedBody(event, body => safeParse(TaskBodyArraySchema, body))
    if (!success) {
      // TODO: write a util that wraps readValidatedBody / createError.
      throw createError({
	statusCode: 400,
	statusMessage: 'Invalid Request',
	message: { issues }
      })
    } else {
      const newTasks = output.map(t => ({ ...t, user_id: user.id })) as NewTask[]
      const updated_at = nowTemporal()
      return await db
	.insertInto('tasks')
	.values(newTasks)
	.returningAll()
	.execute()
    }
  }
})
