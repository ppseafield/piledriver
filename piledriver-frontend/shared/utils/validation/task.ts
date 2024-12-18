import { z } from 'zod'

export const taskSchema = z.object({
  id: z.string().uuid({ message: 'ID is required' }),
  created_by: z.string().uuid({ message: 'Created by is required' }),
  journaled_by: z.nullable(z.string().uuid()),
  routine_from: z.nullable(z.string().uuid()),
  created_at: z.string().datetime(),
  completed_at: z.nullable(z.string().datetime()),
  archived_at: z.nullable(z.string().datetime()),
  task_order: z.nullable(z.number()),
  title: z.string().min(3, { message: 'Title is required' })
}).refine(
  data => !(data.completed_at === null && data.task_order === null),
  {
    message: 'Task order is required if task is not completed',
    path: ['task_order']
  })

export const subtaskSchema = z.object({
  id: z.string().uuid({ message: 'ID is required' }),
  task_id: z.string().uuid({ message: 'Task ID is required' }),
  parent_subtask_id: z.nullable(z.string().uuid()),
  task_sheet_item_id: z.nullable(z.string().uuid()),
  created_by: z.string().uuid({ message: 'Created by is required' }),
  routine_from: z.nullable(z.string().uuid()),
  created_at: z.string().datetime(),
  completed_at: z.nullable(z.string().datetime()),
  archived_at: z.nullable(z.string().datetime()),
  task_order: z.number(),
  title: z.string().min(3, { message: 'Title is required' })
})
