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
    const { journal, task_ids, other_completed, new_remaining } = output
    const newJournal = { ...journal, user_id: user.id } as NewJournal

    // Create the journal.
    const updated_at = nowTemporal()
    const createdJournal: Journal = await db
      .insertInto('journals')
      .values([newJournal])
      .returningAll()
      .executeTakeFirstOrThrow()

    // Assign the existing tasks to this new journal.
    const journaled_by = createdJournal.id
    const updatedTaskIDs = await db
      .updateTable('tasks')
      .set({ journaled_by })
      .where('id', 'in', task_ids)
      .returning('id', 'journaled_by')
      .execute()

    // Create other completed tasks and assign them to this journal.
    let otherCompletedTasks = []
    if (other_completed.length > 0) {
      const completed_at = nowTemporal()
      otherCompletedTasks = await db
	.insertInto('tasks')
	.values(
	  other_completed.map(title => ({
	    user_id: user.id, title, journaled_by, completed_at
	  }))
	)
	.returningAll()
	.execute()
    }

    // Find the max task_order + 1 so we can create waiting tasks.
    let newRemainingTasks = []
    if (new_remaining.length > 0) {
      const { max_task_order } = await db
	.selectFrom('tasks')
	.select(({ fn }) => [fn.max<number>('task_order').as('max_task_order')])
	.where('user_id', '=', user.id)
	.where('journaled_by', 'is', null)
	.where('archived_at', 'is', null)
	.where((eb) => eb.or([
	  eb('completed_at', 'is', null),
	  eb('completed_at', '>=', sql`now() - interval '2 weeks'`)
	]))
	.executeTakeFirstOrThrow()
      
      // Create new tasks that are not complete.
      const nextTaskOrder = Number(max_task_order) + 1
      const values = Array.from(new_remaining.entries()).map(
	([i, title]) => ({ title, user_id: user.id, task_order: nextTaskOrder + i })
      )
      console.log('values sent to postgres:', JSON.stringify(values))
      console.log("\n\n")

      newRemainingTasks = await db
	.insertInto('tasks')
	.values(values)
	.returningAll()
	.execute()
    }

    return {
      journal: createdJournal,
      task_ids: updatedTaskIDs,
      other_completed: otherCompletedTasks,
      new_remaining: newRemainingTasks
    }
  }
})
