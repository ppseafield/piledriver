import { z } from 'zod'

export const subtaskSchema = z.object({
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
}).refine(
  ({ id, task_order }) => !(id !== undefined && task_order === undefined),
  {
    message: 'Task order is required.',
    path: ['task_order']
  }
)

export const subtaskArraySchema = z.array(subtaskSchema)

export const taskSchema = z.object({
  id: z.optional(z.string().uuid({ message: 'ID is required' })),
  created_by: z.string().uuid({ message: 'Created by is required' }),
  journaled_by: z.nullable(z.string().uuid()),
  routine_from: z.nullable(z.string().uuid()),
  created_at: z.string().datetime({ offset: true }),
  completed_at: z.nullable(z.string().datetime({ offset: true })),
  archived_at: z.nullable(z.string().datetime({ offset: true })),
  task_order: z.optional(z.nullable(z.number())),
  title: z.string().min(3, { message: 'Title is required' }),
  subtasks: z.optional(subtaskArraySchema)
}).refine(
  ({ id, completed_at, task_order }) => {
    if (id !== undefined) {
      return completed_at !== null || task_order !== null
    } else {
      return true
    }
  },
  {
    message: 'Task order is required if task is not completed',
    path: ['task_order']
  }
)

export const taskArraySchema = z.array(taskSchema)
