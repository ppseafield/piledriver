import * as v from 'valibot'

export const JournalBodySchema = v.object({
  id: v.optional(v.pipe(v.string(), v.uuid())),
  user_id: v.optional(v.pipe(v.string(), v.uuid())),
  created_at: v.optional(v.isoTimestamp()),
  updated_at: v.optional(v.isoTimestamp()),
  archived_at: v.optional(v.isoTimestamp()),
  title: v.pipe(v.string(), v.minLength(1), v.maxLength(120)),
  text_body: v.pipe(v.string(), v.minLength(1)),
  json_body: v.any()
})

export type JournalBody = v.InferOutput<typeof JournalBodySchema>

export const NewJournalSchema = v.object({
  journal: JournalBodySchema,
  task_ids: v.array(v.pipe(v.string(), v.uuid()))
})
export type NewJournalSchema = v.InferOutput<typeof NewJournalSchema>

export interface JournalCreateResponse {
  journal: Journal
  updated_tasks: Array<{ id: string, journaled_by: string }>
}

export const JournalUpdateSchema = v.object({
  id: v.pipe(v.string(), v.uuid()),
  title: v.pipe(v.string(), v.minLength(1), v.maxLength(120)),
  text_body: v.pipe(v.string(), v.minLength(1)),
  json_body: v.any()
})

export type JournalUpdate = v.InferOutput<typeof JournalUpdateSchema>
