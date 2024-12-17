import type { H3Event, EventHandlerRequest } from 'h3'
import type { LoginSuccess } from '~~/shared/types'
import { loginRequestSchema } from '~~/shared/utils/validation/session'

const productionEnvironment = process.env['NODE_ENV'] === 'production'
const postgrestURL: string = process.env['NUXT_PILEDRIVER_API_URL'] ?? ''

export default defineEventHandler(async (event: H3Event<EventHandlerRequest>) => {
  const loginUrl = `${postgrestURL}/rpc/create_session`
  const loginRequest = await readValidatedBody(event, loginRequestSchema.parse)
  // console.log('POSTING to postgrest:', loginUrl, body);

  let loginResponse

  // eslint-disable @typescript-eslint/no-explicit-any
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
      const jwt = createUserJWT(login)

      setCookie(event, 'session', jwt, {
        maxAge,
        httpOnly: true,
        sameSite: 'strict',
        secure: productionEnvironment
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
      message: e.statusMessage,
      loginResponse
    }
  }
})
