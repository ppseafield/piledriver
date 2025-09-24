import { sql } from 'kysely'
import { db } from '../database'
import type { ReorderTaskResult } from '@@/shared/types/tasks'
import { ReorderTaskRequestSchema } from '@@/shared/types/tasks'

export default defineEventHandler(async (event) => {
  const { user, body } = await requireUserAndValidatedBody(event, ReorderTaskRequestSchema)

  const results = await sql<ReorderTaskResult[]>`SELECT task_id, updated_order FROM public.reorder_task(${user.id}, ${body.move_task_id}, ${body.move_new_order});`
    .execute(db)
  return results.rows
})
