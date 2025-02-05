import type { H3Event, EventHandlerRequest } from 'h3'
import type { MoveTaskResponse } from '~~/shared/types/tasks'
import { updateSubtaskCompletionSchema } from '~~/shared/utils/validation/task'

export default defineEventHandler(async (event: H3Event<EventHandlerRequest>) => {
  const { token } = await getUserSession(event)
  if (!token) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized request' })
  } else {
    const config = useRuntimeConfig()
    const body = await readValidatedBody(event, updateSubtaskCompletionSchema.parse)
    const url = `${config.postgrestUrl}/rpc/update_subtask_completion`
    const ustcResponse = await $fetch<MoveTaskResponse>(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Prefer': 'return=representation',
        'Authorization': `Bearer ${token}`
      },
      body
    })
    return ustcResponse
  }
})
