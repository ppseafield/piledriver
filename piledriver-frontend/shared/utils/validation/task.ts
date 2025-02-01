import { z } from 'zod'

const baseSubtaskSchema = z.object({
  id: z.optional(z.string().uuid({ message: 'ID is required' })),
  task_id: z.string().uuid({ message: 'Task ID is required' }),
  parent_subtask_id: z.nullable(z.string().uuid()),
  task_sheet_item_id: z.nullable(z.string().uuid()),
  created_by: z.string().uuid({ message: 'Created by is required' }),
  routine_from: z.nullable(z.string().uuid()),
  created_at: z.string().datetime({ offset: true }),
  completed_at: z.nullable(z.string().datetime({ offset: true })),
  archived_at: z.nullable(z.string().datetime({ offset: true })),
  task_order: z.optional(z.number()),
  title: z.string().min(3, { message: 'Title is required' })
})

const subtaskSchema = baseSubtaskSchema.extend({
  subtasks: z.optional(baseSubtaskSchema.array())
}).refine(
  /** If the task is on the user's dashboard, it should either be completed or have a task order. */
  ({ id, task_order }) => !(id !== undefined && task_order === undefined),
  {
    message: 'Task order is required.',
    path: ['task_order']
  }
)

export const subtaskArraySchema = z.array(subtaskSchema)

const baseTaskSchema = z.object({
  id: z.optional(z.string().uuid({ message: 'ID is required' })),
  created_by: z.string().uuid({ message: 'Created by is required' }),
  journaled_by: z.nullable(z.string().uuid()),
  routine_from: z.nullable(z.string().uuid()),
  created_at: z.string().datetime({ offset: true }),
  completed_at: z.nullable(z.string().datetime({ offset: true })),
  archived_at: z.nullable(z.string().datetime({ offset: true })),
  task_order: z.optional(z.nullable(z.number())),
  title: z.string().min(3, { message: 'Title is required' }),
  project_id: z.nullable(z.string().uuid()),
  project_assigned: z.boolean()
})

export const taskSchema = baseTaskSchema.refine(
  ({ id, completed_at, task_order, project_id, project_assigned }: z.infer<typeof baseTaskSchema>) => {
    if (id === undefined || (project_id !== null && !project_assigned)) {
      return true
    } else {
      return completed_at !== null || task_order !== null
    }
  },
  {
    message: 'Task order is required if task is not completed',
    path: ['task_order']
  }
)

export const taskArraySchema = z.array(taskSchema)

export const moveTaskSchema = z.object({
  move_task_id: z.string().uuid({ message: 'Task ID is required' }),
  move_new_order: z.number({ message: 'Task order is required' })
})
