import { z } from 'zod'
import { taskSchema } from './task'

const baseJournalSchema = z.object({
  id: z.optional(z.string().uuid({ message: 'ID is required' })),
  created_by: z.string().uuid({ message: 'Created by is required' }),
  created_at: z.string().datetime({ offset: true }),
  archived_at: z.nullable(z.string().datetime({ offset: true })),
  title: z.string().min(3, { message: 'Title is required' }),
  text_body: z.string().min(3, { message: 'Text body is required' }),
  json_body: z.any()
})

export const journalSchema = baseJournalSchema.extend({
  tasks: z.optional(taskSchema.array())
})
