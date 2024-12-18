import type { z } from 'zod'
import type { taskSchema, subtaskSchema } from '../utils/validation/task'

export type Task = z.infer<typeof taskSchema>

export type Subtask = z.infer<typeof subtaskSchema>

export type TasksWithSubtasks = Task & { subtasks: Subtask[] }
