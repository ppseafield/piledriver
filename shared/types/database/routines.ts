import type { 
  Insertable,
  ColumnType,
  Selectable,
  Updateable
} from 'kysely'

export interface RoutinesTable {
  id: string
  user_id: string
  created_at: ColumnType<Date, string | undefined, never>
  updated_at: ColumnType<Date, string | undefined, never>
  archived_at: ColumnType<Date, string | undefined, never>
  title: string
  description: string | null
}

export type Routine = Selectable<RoutinesTable>
export type NewRoutine = Omit<Insertable<RoutinesTable>, 'id', 'created_at' | 'updated_at' | 'archived_at'>
export type UpdateRoutine = Updateable<RoutinesTable>

