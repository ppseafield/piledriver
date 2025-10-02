import * as v from 'valibot'
import type { Routine } from './database/routines'
import { RoutineSubtaskArraySchema } from './routine_subtasks'

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

export const NewRoutineSchema = v.object({
  routine: RoutineBodySchema,
  routine_subtasks: RoutineSubtaskArraySchema
})

export interface RoutineCreateResponse {
  routine: Routine,
  routine_subtasks: string[]
}

export const TaskFromRoutineRequestSchema = v.object({
  routine_id: v.pipe(v.string(), v.uuid()),
  title: v.pipe(v.string(), v.minLength(1), v.maxLength(120)),
  // TODO: new task at user specified position <..>
  task_order: v.pipe(v.number(), v.integer())
})

export type TaskFromRoutineRequest = v.InferOutput<typeof TaskFromRoutineRequestSchema>

export interface TaskFromRoutineResponse {
  task: Task
  subtasks: Subtask[]
  // TODO: new task at position <..>
  // updated_orders: ReorderTaskResult[]
}
