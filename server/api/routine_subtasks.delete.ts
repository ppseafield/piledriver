import { sql } from 'kysely'
import { db } from '../database'

export default defineEventHandler(async (event) => {
  const { user, query } = await requireUserAndValidateQuery(event, ArchiveRoutineSubtaskSchema)
  return { todo: 'archive routine subtask' }
})
