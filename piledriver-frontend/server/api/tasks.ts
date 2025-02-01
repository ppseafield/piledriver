import { twoWeeksAgo } from '~~/shared/utils/temporal-helpers'
import { taskArraySchema } from '~~/shared/utils/validation/task'

export const fields = [
  'id',
  'created_by',
  'journaled_by',
  'routine_from',
  'created_at',
  'completed_at',
  'archived_at',
  'task_order',
  'title',
  'project_id',
  'project_assigned'
]

const tasksResource = new PostgRESTResource({
  endpoint: 'tasks',
  fields,
  allowAnonymous: false,
  additionalParams: {
    GET: {
      default: {
        defaultParams: [
          ['order', 'task_order.asc'],
          ['journaled_by', 'is.null'],
          ['or', '(project_id.is.null,project_assigned.is.true)']
        ]
      },
      unjournaled: {
        defaultParams: [
          ['order', 'completed_at.asc'],
          ['and', '(completed_at.not.is.null,journaled_by.is.null)'],
          ['or', '(project_id.is.null,project_assigned.is.true)']
        ]
      },
      project: {
        defaultParams: [
          ['order', 'task_order.asc']
        ],
        allowedParams: ['project_id']
      }
    }
  },
  schema: taskArraySchema
})

export default defineEventHandler(tasksResource.handle)
