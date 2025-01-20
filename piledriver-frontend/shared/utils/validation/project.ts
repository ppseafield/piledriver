import { z } from 'zod'
import { taskSchema } from './task'

const baseProjectSchema = z.object({
  id: z.optional(z.string().uuid({ message: 'ID is required' })),
  created_by: z.string().uuid({ message: 'Created by is required' }),
  created_at: z.string().datetime({ offset: true }),
  archived_at: z.nullable(z.string().datetime({ offset: true })),
  title: z.string().min(3, { message: 'Title is required' }),
  descption: z.nullable(z.string()),
  color: z.nullable(z.string()),
  icon_name: z.nullable(z.string())
})

export const projectSchema = baseProjectSchema.extend({
  tasks: z.optional(taskSchema.array())
})
