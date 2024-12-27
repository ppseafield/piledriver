import type { z } from 'zod'
import type { taskSchema, subtaskSchema, moveTaskSchema } from '../utils/validation/task'
import type { UUID } from './core'

export type Task = z.infer<typeof taskSchema>

export type Subtask = z.infer<typeof subtaskSchema>

export type TasksWithSubtasks = Task & { subtasks: Subtask[] }

export type MoveTaskRequest = z.infer<typeof moveTaskSchema>

export interface TaskOrdering {
  task_id: UUID
  updated_order: number
}
export type MoveTaskResponse = TaskOrdering[]
