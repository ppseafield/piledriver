import { db } from '@@/server/database'
import { ReorderTaskRequestSchema } from '@@/shared/types/tasks'
import { reorder_task } from '@@/shared/types/database/table_functions'

export default defineEventHandler(async (event) => {
  const { user, body } = await requireUserAndValidatedBody(event, TaskFromRoutineRequestSchema)

  const { routine_id, title, task_order } = body

  const newTask = await db
    .insertInto('tasks')
    .values({
      user_id: user.id,
      routine_from: routine_id,
      task_order,
      title
    })
    .returningAll()
    .executeTakeFirst()

  const subtasks = await db
    .insertInto('task_subtasks')
    .columns(['user_id', 'task_id', 'task_order', 'title'])
    .expression(
      (eb) => eb
	.selectFrom('routine_subtasks')
	.select((eb) => [
	  'user_id',
	  eb.val(newTask.id).as('task_id'),
	  'task_order',
	  'title'
	])
	.where('routine_id', '=', routine_id)
	.where('user_id', '=', user.id)
	.where('archived_at', 'is', null)
	.orderBy('task_order')
    )
    .returningAll()
    .execute()

  return {
    task: newTask,
    subtasks
  }
})
