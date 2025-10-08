import * as v from 'valibot'

export const TaskBodySchema = v.object({
  id: v.optional(v.uuid()),
  user_id: v.optional(v.uuid()),
  routine_from: v.optional(v.uuid()),
  journaled_by: v.optional(v.uuid()),
  created_at: v.optional(v.isoTimestamp()),
  updated_at: v.optional(v.isoTimestamp()),
  completed_at: v.optional(v.isoTimestamp()),
  archived_at: v.optional(v.isoTimestamp()),
  task_order: v.nullable(v.pipe(v.number(), v.integer())),
  title: v.pipe(v.string(), v.minLength(1)),
  project_id: v.nullable(v.uuid()),
  project_assigned: v.nullable(v.isoTimestamp())
})

export type TaskBody = v.InferOutput<typeof TaskBodySchema>

export const TaskBodyArraySchema = v.array(TaskBodySchema)
export type TaskBodyArray = v.Infer<typeof TaskBodyArraySchema>


// Reorder tasks request/response
export const ReorderTaskRequestSchema = v.object({
  move_task_id: v.pipe(v.string(), v.uuid()),
  move_new_order: v.pipe(v.number(), v.integer(), v.minValue(1))
})

export interface ReorderTaskResult {
  task_id: string
  updated_order: number
}

// Complete task
export const CompleteTaskRequestSchema = v.object({
  completed_task_id: v.pipe(v.string(), v.uuid())
})

export interface CompleteTaskResult {
  task_id: string
  updated_order: number | null
  updated_completed_at: string | null
}

// Uncomplete task
export const UncompleteTaskRequestSchema = v.object({
  task_id: v.pipe(v.string(), v.uuid())
})

export const ArchiveTaskSchema = v.object({
  archive_task_id: v.pipe(v.string(), v.uuid())
})

export interface ArchiveTaskResult {
  task_id: string
  updated_order: number | null
  updated_archived_at: string | null
}
