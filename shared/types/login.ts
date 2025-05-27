import * as v from 'valibot'

export const LoginRequestSchema = v.object({
  username: v.pipe(v.string(), v.minLength(6, 'login.username.tooShort')),
  password: v.pipe(v.string(), v.minLength(10, 'login.password.tooShort'))
})

export type LoginRequest = v.InferOutput<typeof LoginSchema>

