import { safeParse } from 'valibot'

// These functions combine validation that is commonly used together in server routes.

export const requireUserAndValidatedParams = async (event, schema) => {
  const { user } = await requireUserSession(event)
  const { success, output, issues } = await getValidatedRouterParams(event, params => safeParse(schema, params))

  if (!success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'errors.request.invalid',
      message: JSON.stringify({ issues })
    })
  } else {
    return {
      user,
      params: output
    }
  }
}

export const requireUserAndValidatedBody = async (event, schema) => {
  const { user } = await requireUserSession(event)
  const { success, output, issues } = await readValidatedBody(event, body => safeParse(schema, body))

  if (!success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'errors.request.invalid',
      message: JSON.stringify({ issues })
    })
  } else {
    return {
      user,
      body: output
    }
  }
}

export const requireUserAndValidatedQuery = async (event, schema) => {
  const { user } = await requireUserSession(event)
  const { success, output, issues } = await getValidatedQuery(event, query => safeParse(schema, query))

  if (!success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'errors.request.invalid',
      message: JSON.stringify({ issues })
    })
  } else {
    return {
      user,
      query: output
    }
  }  
}
