import * as v from 'valibot'
import type { Routine } from './database/routines'

export const RoutineBodySchema = v.object({
  id: v.optional(v.pipe(v.string(), v.uuid())),
  user_id: v.optional(v.pipe(v.string(), v.uuid())),
  created_at: v.optional(v.pipe(v.string(), v.isoTimestamp())),
  updated_at: v.optional(v.pipe(v.string(), v.isoTimestamp())),
  archived_at: v.optional(v.pipe(v.string(), v.isoTimestamp())),
  title: v.pipe(v.string(), v.minLength(1), v.maxLength(120)),
  description: v.nullable(v.pipe(v.string(), v.minLength(1), v.maxLength(120))),
})

export type RoutineBody = v.InferOutput<typeof RoutineBodySchema>

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



export const NewRoutineSchema = v.object({
  routine: RoutineBodySchema,
  routine_subtasks: v.array(RoutineSubtaskBodySchema)
})

export interface RoutineCreateResponse {
  routine: Routine,
  routine_subtasks: string[]
}
