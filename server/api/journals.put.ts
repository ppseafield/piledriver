import { safeParse } from 'valibot'
import { sql } from 'kysely'
import { db } from '../database'

export default defineEventHandler(async (event) => {
  const { user } = await getUserSession(event)

  if (!user?.id) {
    throw createError({
      statusCode: 401,
      statusMessage: 'errors.network.notAuthorized',
      message: JSON.stringify(session)
    })
  } else {
    const { success, output, issues } = await readValidatedBody(event, body => {
      return safeParse(JournalUpdateSchema, body)
    })
    if (!success) {
      // TODO: write a util that wraps readValidatedBody / createError.
      throw createError({
	statusCode: 400,
	statusMessage: 'Invalid Request',
	message: { issues }
      })
    } else {
      const { id, updated_at, ...taskUpdates } = output
      return await db
	.update('journals')
	.set({
	  ...taskUpdates,
	  updated_at: nowTemporal()
	})
	.returningAll()
	.executeTakeFirstOrThrow()
    }
  }
})
