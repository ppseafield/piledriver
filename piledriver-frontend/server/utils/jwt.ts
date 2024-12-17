import jwt from 'jsonwebtoken'
import type { LoginSuccess } from '~~/shared/types'

export const maxAge: number = 7 * 24 * 3600 // 1 week

export function createUserJWT({ user_id, session_id }: LoginSuccess) {
  const config = useRuntimeConfig()
  return jwt.sign(
    {
      role: 'piledriver_user',
      user_id,
      session_id,
    },
    config.jwtSecret,
    { expiresIn: maxAge },
  )
}
