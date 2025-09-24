import { sql } from 'kysely'
import { db } from '../database'
import type { CompleteTaskResult } from '@@/shared/types/tasks'
import { CompleteTaskRequestSchema } from '@@/shared/types/tasks'

export default defineEventHandler(async (event) => {
  const { user, body } = await requireUserAndValidatedBody(event, CompleteTaskRequestSchema)
  
  // TODO: wrap functions type-safely using Kysely plugin/extention or the like.
  const results = await sql<CompleteTaskResult[]>`SELECT task_id, updated_order, updated_completed_at FROM public.complete_task(${user.id}, ${body.completed_task_id});`
    .execute(db)
  return results.rows
})
