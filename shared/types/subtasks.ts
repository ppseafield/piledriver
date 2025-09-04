import * as v from 'valibot'

export const SubtaskBodySchema = v.object({
  id: v.optional(v.pipe(v.string(), v.uuid())),
  user_id: v.nullable(v.pipe(v.string(), v.uuid())),
  task_id: v.pipe(v.string(), v.uuid()),
  parent_subtask_id: v.nullable(v.pipe(v.string(), v.uuid())),
  created_at: v.optional(v.isoTimestamp()),
  updated_at: v.nullable(v.isoTimestamp()),
  archived_at: v.nullable(v.isoTimestamp()),
  completed_at: v.nullable(v.isoTimestamp()),
  task_order: v.nullable(v.pipe(v.number(), v.integer())),
  title: v.pipe(v.string(), v.minLength(1))
})

export type SubtaskBody = v.inferOutput<typeof SubtaskBodySchema>
export const SubtaskBodyArraySchema = v.array(SubtaskBodySchema)
export type SubtaskBodyArray = v.Infer<typeof SubtaskBodyArraySchema>

// Reorder subtasks request/response
export const ReorderSubtaskRequestSchema = v.object({
  move_subtask_id: v.pipe(v.string(), v.uuid()),
  move_new_order: v.pipe(v.number(), v.integer(), v.minValue(1))
})

export interface ReorderSubtaskResult {
  subtask_id: string
  updated_order: number
}

// TODO: Not used until subtasks can be nested
// Complete subtask
export const CompleteSubtaskRequestSchema = v.object({
  completed_subtask_id: v.pipe(v.string(), v.uuid())
})

export interface CompleteSubtaskResult {
  subtask_id: string
  updated_completed_at: string | null
}

// Uncomplete subtask
export const UncompleteSubtaskRequestSchema = v.object({
  subtask_id: v.pipe(v.string(), v.uuid())
})

export const ArchiveSubtaskSchema = v.object({
  archive_subtask_id: v.pipe(v.string(), v.uuid())
})

export interface ArchiveSubtaskResult {
  subtask_id: string
  updated_order: number | null
  updated_archived_at: string | null
}
