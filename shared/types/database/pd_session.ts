import type { 
  Insertable,
  JSONColumnType,
  Selectable,
  Updateable
} from 'kysely'

export interface SessionTable {
  id: string
  user_id: string
  created_at: ColumnType<Date, string, never>
  expires_at: Column<Date, string, never>
  logged_out_at: Column<Date, string, never>
}

export type Session = Selectable<SessionTable>
export type NewSession = Omit<Insertable<SessionTable>, 'id' | 'created_at' | 'expires_at' | 'logged_out_at'>
export type UpdateSession = Updateable<SessionTable>
