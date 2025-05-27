import type { 
  Insertable,
  JSONColumnType,
  Selectable,
  Updateable
} from 'kysely'

export interface PasswordsTable {
  user_id: string
  password_hash: string
}

export type Password = Selectable<PasswordTable>
export type NewPassword = Insertable<PasswordTable>
export type UpdatePassword = Updateable<PasswordTable>

