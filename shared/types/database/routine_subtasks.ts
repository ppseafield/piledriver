import type { 
  Insertable,
  ColumnType,
  Selectable,
  Updateable
} from 'kysely'

export interface RoutineSubtasksTable {
  id: string
  routine_id: string
  user_id: string
  created_at: ColumnType<Date, string | undefined, never>
  updated_at: ColumnType<Date, string | undefined, never>
  archived_at: ColumnType<Date, string | undefined, never>
  task_order: number
  title: string
}

export type RoutineSubtask = Selectable<RoutineSubtasksTable>
export type NewRoutineSubtask = Omit<Insertable<RoutineSubtasksTable>, 'id', 'created_at' | 'updated_at' | 'archived_at'>
export type UpdateRoutineSubtask = Updateable<RoutineSubtasksTable>
