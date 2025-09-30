import * as v from 'valibot'

// TODO: some of these validators are all over the place: optional, nullable, etc. FIX
export const RoutineSubtaskBodySchema = v.object({
  id: v.pipe(v.string(), v.uuid()),
  routine_id: v.pipe(v.string(), v.uuid()),
  user_id: v.pipe(v.string(), v.uuid()),
  created_at: v.pipe(v.string(), v.isoTimestamp()),
  updated_at: v.nullable(v.pipe(v.string(), v.isoTimestamp())),
  archived_at: v.nullable(v.pipe(v.string(), v.isoTimestamp())),
  task_order: v.pipe(v.number(), v.integer()),
  title: v.pipe(v.string(), v.minLength(1), v.maxLength(120))
})

export type RoutineSubtaskBody = v.InferOutput<typeof RoutineSubtaskBodySchema>
export const RoutineSubtaskArraySchema = v.array(RoutineSubtaskBodySchema)
export type RoutineSubtaskArray = v.inferOutput<typeof RoutineSubtaskArraySchema>

export const ReorderRoutineSubtaskRequestSchema = v.object({
  move_routine_subtask_id: v.pipe(v.string(), v.uuid()),
  move_new_order: v.pipe(v.number(), v.integer(), v.minValue(1))
})

export interface ReorderRoutineSubtaskResult {
  routine_subtask_id: string
  updated_order: number
}

export const ArchiveRoutineSubtaskSchema = v.object({
  archive_routine_subtask_id: v.pipe(v.string(), v.uuid())
})

export interface ArchiveRoutineSubtaskResult {
  routine_subtask_id: string
  updated_order: number | null
  updated_archived_at: string | null
}
