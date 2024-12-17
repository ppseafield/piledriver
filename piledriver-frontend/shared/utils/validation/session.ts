import { z } from 'zod'

export const loginRequestSchema = z.object({
  username: z.string().min(3, { message: 'Please enter a valid username' }),
  password: z.string().min(8, { message: 'Please enter a valid password' })
})
