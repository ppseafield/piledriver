import { sql } from 'kysely'
import { db } from '../database'

export default defineEventHandler(async (event) => {
  const { user, query } = await requireUserAndValidatedQuery(event, ArchiveRoutineSchema)

  return await db
    .updateTable('routines')
    .set({
      archived_at: nowTemporal()
    })
    .where('id', '=', query.archive_routine_id)
    .where('user_id', '=', user.id)
    .returningAll()
    .execute()
})
