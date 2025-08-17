import { safeParse } from 'valibot'
import { sql } from 'kysely'
import { db } from '../database'

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
    const { success, output, issues } = await getValidatedQuery(event, query => safeParse(ArchiveTaskSchema, query))
    if (!success) {
      // TODO: write a util that wraps readValidatedBody / createError.
      throw createError({
	statusCode: 400,
	statusMessage: 'Invalid Request',
	message: JSON.stringify({ issues })
      })
    } else {
      const results = await sql<CompleteTaskResult[]>`SELECT task_id, updated_order, updated_archived_at FROM public.archive_task(${user.id}, ${output.archive_task_id});`
        .execute(db)
      return results.rows
    }
  }
})
