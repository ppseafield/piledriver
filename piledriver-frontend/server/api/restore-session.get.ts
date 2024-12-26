import type { H3Event, EventHandlerRequest } from 'h3'
import type { LoginSuccess } from '~~/shared/types'

export default defineEventHandler(async (event: H3Event<EventHandlerRequest>) => {
  const jwt = getCookie(event, 'session') ?? null
  if (jwt === null) {
    return []
  } else {
    const config = useRuntimeConfig()
    const url = `${config.postgrestUrl}/rpc/restore_session`
    const restoreResponse = await $fetch<LoginSuccess[]>(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Prefer': 'return=representation',
        'Authorization': `Bearer ${jwt}`
      }
    })
    // TODO: extend session? must ponder...
    return restoreResponse
  }
})
