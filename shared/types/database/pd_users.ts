import type { 
  ColumnType,
  Insertable,
  JSONColumnType,
  Selectable,
  Updateable
} from 'kysely'

export interface UserTable {
  id: string
  username: string
  email: string
  avatar_url: string | null
  created_at: ColumnType<Date, string, never>
  updated_at: ColumnType<Date, string>
  preferences: JSONColumnType<{
    theme: string
  } | null>
}
export type User = Selectable<UserTable>
export type NewUser = Omit<Insertable<UserTable>, 'id' | 'created_at' | 'updated_at'>
export type UpdateUser = Updateable<UserTable>

