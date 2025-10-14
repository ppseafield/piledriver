import type { 
  Insertable,
  ColumnType,
  Selectable,
  Updateable
} from 'kysely'

export interface ProjectsTable {
  id: string
  user_id: string
  created_at: ColumnType<Date, string | undefined, never>
  updated_at: ColumnType<Date, string | undefined, never>
  archived_at: ColumnType<Date | null, string | undefined, never>
  title: string
  description: string | null
  // TODO: color: string
}

export type Project = Selectable<ProjectsTable>
export type NewProject = Omit<Insertable<ProjectsTable>, 'id' | 'created_at' | 'updated_at' | 'archived_at'>
export type UpdateProject = Updateable<ProjectsTable>

