import { sql } from 'kysely'
import { db } from '@@/server/database'

export default defineEventHandler(async (event) => {
  const { user, params } = await requireUserAndValidatedParams(event, SingleUuidRouteSchema)

  const project = await db
    .selectFrom('projects')
    .selectAll()
    .where('user_id', '=', user.id)
    .where('id', '=',  params.id)
    .orderBy('created_at', 'desc')
    .executeTakeFirstOrThrow()

  const tasks = await db
    .selectFrom('tasks')
    .selectAll()
    .where('user_id', '=', user.id)
    .where('project_id', '=', project.id)
    .orderBy('title')
    .execute()

  return {
    project,
    tasks
  }
})
