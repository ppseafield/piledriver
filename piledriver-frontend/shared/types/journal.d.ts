import type { Z } from 'vitest/dist/chunks/reporters.D7Jzd9GS.js'
import type { journalSchema } from '../utils/validation/journal'

export type Journal = Z.infer<typeof journalSchema>
