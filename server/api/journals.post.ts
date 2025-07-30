import { safeParse } from 'valibot'
import { sql } from 'kysely'
import { db } from '../database'

export default defineEventHandler(async (event) => {
  const { user } = await getUserSession(event)

  const { success, output, issues } = await readValidatedBody(event, body => {
    return safeParse(NewJournalSchema, body)
  })
  if (!success) {
    // TODO: write a util that wraps readValidatedBody / createError.
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid Request',
      message: { issues: JSON.stringify(issues) }
    })
  } else {
    const { journal, task_ids } = output
    const newJournal = { ...journal, user_id: user.id } as NewJournal

    const updated_at = nowTemporal()
    const createdJournal: Journal = await db
      .insertInto('journals')
      .values([newJournal])
      .returningAll()
      .executeTakeFirstOrThrow()

    const journaled_by = createdJournal.id
    const updatedTaskIDs = await db
      .updateTable('tasks')
      .set({ journaled_by })
      .where('id', 'in', task_ids)
      .returning('id', 'journaled_by')
      .execute()

    return {
      journal: createdJournal,
      task_ids: updatedTaskIDs
    }
  }
})
