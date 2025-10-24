import type { 
  Insertable,
  ColumnType,
  Selectable,
  Updateable
} from 'kysely'

export interface JournalsTable {
  id: string
  user_id: string
  created_at: ColumnType<Date, string | undefined, never>
  updated_at: ColumnType<Date, string | undefined, never>
  completed_at: ColumnType<Date | null, string | undefined, never>
  archived_at: ColumnType<Date | null, string | undefined, never>
  title: string
  text_body: string
  json_body: unknown // result of tiptap's internal format
}

export type Journal = Selectable<JournalsTable>
export type NewJournal = Insertable<JournalsTable>
export type UpdateJournal = Updateable<JournalsTable>

