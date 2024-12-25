import { twoWeeksAgo } from '~~/shared/utils/temporal-helpers'
import { taskArraySchema } from '~~/shared/utils/validation/task'

const fields = [
  'id',
  'created_by',
  'journaled_by',
  'routine_from',
  'created_at',
  'completed_at',
  'archived_at',
  'task_order',
  'title'
]
const subtasks = [
  'id',
  'task_id',
  'parent_subtask_id',
  'task_sheet_item_id',
  'created_by',
  'routine_from',
  'created_at',
  'completed_at',
  'archived_at',
  'task_order',
  'title'
]

const tasksResource = new PostgRESTResource({
  endpoint: 'tasks',
  fields,
  allowAnonymous: false,
  embeddedResources: { subtasks },
  additionalParams: {
    GET: [
      ['order', 'task_order.asc'],
      ['or', `(completed_at.is.null,and(completed_at.gte.${twoWeeksAgo()},journaled_by.is.null))`]
    ]
  },
  schema: taskArraySchema
})

export default defineEventHandler(async (event) => {
  console.log('Got request for resource', tasksResource.url)
  const response = await tasksResource.handle(event)
  console.log('response from tasks:', response)
  return response
})
