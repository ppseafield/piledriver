import type { H3Event, EventHandlerRequest } from 'h3'
import type { MoveTaskResponse } from '~~/shared/types/tasks'
import { moveTaskSchema } from '~~/shared/utils/validation/task'

export default defineEventHandler(async (event: H3Event<EventHandlerRequest>) => {
  const { token } = await getUserSession(event)
  if (token === null) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized request' })
  } else {
    const config = useRuntimeConfig()
    const body = await readValidatedBody(event, moveTaskSchema.parse)
    const url = `${config.postgrestUrl}/rpc/move_task_and_rebalance`
    const restoreResponse = await $fetch<MoveTaskResponse>(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Prefer': 'return=representation',
        'Authorization': `Bearer ${token}`
      },
      body
    })
    return restoreResponse
  }
})
