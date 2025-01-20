import type { z } from 'zod'
import type { projectSchema } from '../utils/validation/project'

export type Project = z.infer<typeof projectSchema>
