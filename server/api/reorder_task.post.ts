import * as v from 'valibot'
import { sql } from 'kysely'
import { db } from '../database'
import type { ReorderTaskResult } from '@@/shared/types/tasks'
import { ReorderTaskRequestSchema } from '@@/shared/types/tasks'

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
    const { success, output, issues } = await readValidatedBody(event, body => v.safeParse(ReorderTaskRequestSchema, body))
    if (!success) {
      // TODO: write a util that wraps readValidatedBody / createError.
      throw createError({
	statusCode: 400,
	statusMessage: 'Invalid Request',
	message: JSON.stringify({ issues })
      })
    } else {
      const results = await sql<ReorderTaskResult[]>`SELECT task_id, updated_order FROM public.reorder_task(${user.id}, ${output.move_task_id}, ${output.move_new_order});`
        .execute(db)
      return results.rows
    }
  }
})
