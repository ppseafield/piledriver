import * as v from 'valibot'
import { sql } from 'kysely'
import { db } from '../database'
import type { ReorderTaskResult } from '@@/shared/types/tasks'
import { ReorderTaskRequestSchema } from '@@/shared/types/tasks'

export default defineEventHandler(async (event) => {
  const { user} = await requireUserSession(event)
    const { success, output, issues } = await readValidatedBody(event, body => v.safeParse(ReorderSubtaskRequestSchema, body))
  if (!success) {
    // TODO: write a util that wraps readValidatedBody / createError.
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid Request',
      message: JSON.stringify({ issues })
    })
  } else {
    const results = await sql<ReorderTaskResult[]>`SELECT subtask_id, updated_order FROM public.reorder_subtask(${user.id}, ${output.move_subtask_id}, ${output.move_new_order});`
        .execute(db)
    return results.rows
  }
})
