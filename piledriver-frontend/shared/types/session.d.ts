import type { z } from 'zod'
import type { loginRequestSchema } from '../utils/validation/session'
import type { UUID, Timestamp } from './core'

export interface User {
  user_id: UUID
  username: string
  email: string | null
  created_at: Timestamp
  archived_at: Timestamp | null
  session_id: UUID | null
}

export type AuthStatus = 'user' | 'anonymous' | 'unknown'

export type LoginRequest = z.infer<typeof loginRequestSchema>

export interface LoginSuccess {
  user_id: UUID
  session_id: UUID
}
