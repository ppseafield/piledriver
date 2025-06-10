import * as v from 'valibot'

export const TaskBodySchema = v.object({
  id: v.optional(v.uuid()),
  user_id: v.optional(v.uuid()),
  routine_from: v.optional(v.uuid()),
  journaled_by: v.optional(v.uuid()),
  created_at: v.optional(v.isoTimestamp()),
  updated_at: v.optional(v.isoTimestamp()),
  archived_at: v.optional(v.isoTimestamp()),
  task_order: v.nullable(v.pipe(v.number(), v.integer())),
  title: v.pipe(v.string(), v.minLength(1))
})

export type TaskBody = v.InferOutput<typeof TaskBodySchema>

export const TaskBodyArraySchema = v.array(TaskBodySchema)
export type TaskBodyArray = v.Infer<typeof TaskBodyArraySchema>
