import { sql } from 'kysely'
import { db } from '../database'

export default defineEventHandler(async (event) => {
  const { user, body } = await requireUserAndValidatedBody(event, JournalUpdateSchema)
  const { id, ...taskUpdates } = body
  return await db
    .updateTable('journals')
    .set({
      ...taskUpdates,
      updated_at: nowTemporal()
    })
    .where('id', '=', body.id)
    .returningAll()
    .executeTakeFirstOrThrow()
})
