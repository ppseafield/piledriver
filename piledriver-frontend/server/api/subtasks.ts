import { subtaskArraySchema } from '~~/shared/utils/validation/task'

const fields = [
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

const subtasksResource = new PostgRESTResource({
  endpoint: 'subtasks',
  fields,
  allowAnonymous: false,
  schema: subtaskArraySchema
})

export default defineEventHandler(subtasksResource.handle)