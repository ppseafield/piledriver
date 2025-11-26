import { db } from '@@/server/database'
import { ReorderTaskRequestSchema } from '@@/shared/types/tasks'
import { split_task } from '@@/shared/types/database/table_functions'

export default defineEventHandler(async (event) => {
  const { user, params } = await requireUserAndValidatedParams(event, SingleUuidRouteSchema)

 return await db
   .selectFrom(split_task(user.id, query.id))
   .selectAll()
   .execute()
})
