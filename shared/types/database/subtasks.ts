import type { 
  Insertable,
  ColumnType,
  Selectable,
  Updateable
} from 'kysely'

export interface SubtasksTable {
  id: string
  user_id: string
  task_id: string
  parent_subtask_id: string | null
  created_at: ColumnType<Date, string | undefined, never>
  updated_at: ColumnType<Date, string | undefined, never>
  completed_at: ColumnType<Date | null, string | undefined, never>
  archived_at: ColumnType<Date | null, string | undefined, never>
  task_order: number | null
  title: string
}

export type Subtask = Selectable<SubtasksTable>
export type NewSubtask = Omit<Insertable<SubtasksTable>, 'id' | 'created_at' | 'updated_at' | 'archived_at'>
export type UpdateSubtask = Updateable<SubtasksTable>
