import type { 
  Insertable,
  ColumnType,
  Selectable,
  Updateable
} from 'kysely'

export interface TasksTable {
  id: string
  user_id: string
  routine_from: string | null
  journaled_by: string | null
  created_at: ColumnType<Date, string | undefined, never>
  updated_at: ColumnType<Date, string | undefined, never>
  completed_at: ColumnType<Date, string | undefined, never>
  archived_at: ColumnType<Date, string | undefined, never>
  task_order: number | null
  title: string
}

export type Task = Selectable<TasksTable>
export type NewTask = Omit<Insertable<TasksTable>, 'id' | 'created_at' | 'updated_at' | 'archived_at'>
export type UpdateTask = Updateable<TasksTable>
