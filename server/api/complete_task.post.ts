import * as v from 'valibot'
import { sql } from 'kysely'
import { db } from '../database'
import type { CompleteTaskResult } from '@@/shared/types/tasks'
import { CompleteTaskRequestSchema } from '@@/shared/types/tasks'

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
    const { success, output, issues } = await readValidatedBody(event, body => v.safeParse(CompleteTaskRequestSchema, body))
    if (!success) {
      // TODO: write a util that wraps readValidatedBody / createError.
      throw createError({
	statusCode: 400,
	statusMessage: 'Invalid Request',
	message: JSON.stringify({ issues })
      })
    } else {
      const results = await sql<CompleteTaskResult[]>`SELECT task_id, updated_order, updated_completed_at FROM public.complete_task(${user.id}, ${output.completed_task_id});`
        .execute(db)
      return results.rows
    }
  }
})
