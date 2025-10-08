import { sql } from 'kysely'
import { db } from '../database'
import { NewRoutineSchema } from '@@/shared/types/routines'

export default defineEventHandler(async (event) => {
  const { user, body } = await requireUserAndValidatedBody(event, NewRoutineSchema)

  const newRoutine = {
    ...body.routine,
    user_id: user.id
  }
  // TODO: create routine and tasks together at same time?! Maybe?

  const updated_at = nowTemporal()
  return await db
    .insertInto('routines')
    .values([newRoutine])
    .returningAll()
    .execute()
})
