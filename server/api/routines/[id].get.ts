import { sql } from 'kysely'
import { db } from '@@/server/database'

export default defineEventHandler(async (event) => {
  const { user, params } = await requireUserAndValidatedParams(event, SingleUuidRouteSchema)
  
    const routine = await db
      .selectFrom('routines')
      .selectAll()
      .where('user_id', '=', user.id)
      .where('id', '=', params.id)
      .orderBy('created_at', 'desc')
      .executeTakeFirstOrThrow()

    const subtasks = await db
      .selectFrom('routine_subtasks')
      .selectAll()
      .where('user_id', '=', sql<string>`${user.id}`)
      .where('routine_id', '=', routine.id)
      .orderBy('task_order')
      .execute()

    return {
      routine,
      subtasks
    }

})
