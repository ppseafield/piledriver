import { sql } from 'kysely'
import { db } from '../database'
import type { ReorderTaskResult } from '@@/shared/types/tasks'
import { ReorderTaskRequestSchema } from '@@/shared/types/tasks'

export default defineEventHandler(async (event) => {
  const { user, body } = await requireUserAndValidatedBody(event, ReorderSubtaskRequestSchema)
  const results = await sql<ReorderTaskResult[]>`SELECT subtask_id, updated_order FROM public.reorder_subtask(${user.id}, ${body.move_subtask_id}, ${body.move_new_order});`
    .execute(db)
  return results.rows
})
