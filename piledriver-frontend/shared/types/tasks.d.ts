import type { z } from 'zod'
import type {
  taskSchema,
  subtaskSchema,
  moveTaskSchema,
  updateSubtaskCompletionSchema
} from '../utils/validation/task'
import type { UUID } from './core'

export type Task = z.infer<typeof taskSchema>

export type Subtask = z.infer<typeof subtaskSchema>

export type TasksWithSubtasks = Task & { subtasks: Subtask[] }

// Move Task Order types
export type MoveTaskRequest = z.infer<typeof moveTaskSchema>

export interface TaskOrdering {
  task_id: UUID
  updated_order: number
}
export type MoveTaskResponse = TaskOrdering[]

// Update Subtask Completion types
export type UpdateSubtaskCompletionRequest = z.infer<typeof updateSubtaskCompletionSchema>

export interface SubtaskCompletion {
  st_id: UUID
  new_completed: Timestamp | null
}
