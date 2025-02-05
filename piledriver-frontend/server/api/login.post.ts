import type { H3Event, EventHandlerRequest } from 'h3'
import type { LoginSuccess } from '~~/shared/types'
import { loginRequestSchema } from '~~/shared/utils/validation/session'

export default defineEventHandler(async (event: H3Event<EventHandlerRequest>) => {
  const config = useRuntimeConfig()
  const loginUrl = `${config.postgrestUrl}/rpc/create_session`
  const loginRequest = await readValidatedBody(event, loginRequestSchema.parse)

  let loginResponse
  try {
    loginResponse = await $fetch<LoginSuccess[]>(loginUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: {
        // The RPC create_session has a named argument of password_text as to not
        // overlap with the SQL keyword `PASSWORD`.
        username_text: loginRequest.username,
        password_text: loginRequest.password
      }
    })
    if (loginResponse.length > 0) {
      const login = loginResponse[0] as LoginSuccess
      const token = createUserJWT(login)

      /* setCookie(event, 'session', jwt, {
        maxAge,
        httpOnly: true,
        sameSite: 'strict',
        secure: config.nodeEnv === 'production'
      }) */

      await setUserSession(event, {
        user: login as User,
        loggedInAt: nowTemporal(),
        token
      })
      return login
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    setResponseStatus(e.statusCode)
    return {
      error: 'LOGIN_FAILED',
      cool: 'awesome',
      status: e.status,
      message: e.statusMessage
    }
  }
})
