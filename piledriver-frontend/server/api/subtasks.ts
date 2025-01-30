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
  'title',
  'tasks()' // allows us to filter on task fields
]

const subtasksResource = new PostgRESTResource({
  endpoint: 'subtasks',
  fields,
  allowAnonymous: false,
  additionalParams: {
    GET: {
      default: {
        defaultParams: [
          ['order', 'task_id.asc,parent_subtask_id.nullsfirst,task_order.asc'],
          ['tasks.journaled_by', 'is.null'],
          ['tasks.or', '(project_id.is.null,project_assigned.is.true)']
        ]
      }
    }
  },
  schema: subtaskArraySchema
})

export default defineEventHandler(subtasksResource.handle)
