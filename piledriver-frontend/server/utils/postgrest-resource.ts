import type { H3Event, EventHandlerRequest, HTTPMethod } from 'h3'
import { set, type z } from 'zod'

export interface RequestError {
  statusCode: number
  message: string
}

/**
 * Describes any number of named PostgREST parameters. Placing them in the server
 * resource definition means a Resource can send multiple kinds of requests to the
 * PostgREST server without pulling and sending raw request parameters from the client.
 *
 * @example
 * {
 *   GET: {
 *     'default': [['order', 'task_order.asc']],
 *     'unjournaled': [
 *       ['completed_at', 'not.is.null'],
 *       ['journaled_by', 'is.null']
 *     ]
 *   }
 * }
 */
type ResourceAdditionalParams = Partial<Record<HTTPMethod, Record<string, string[][]>>>

interface PostgRESTResourceDescription<TSchema> {
  endpoint: string
  fields: string[]
  allowAnonymous: boolean | Record<HTTPMethod, boolean>
  embeddedResources?: Record<string, string[]>
  additionalParams?: ResourceAdditionalParams
  schema: TSchema
}

function defaultAllowAnonymous(allow: boolean = false) {
  return { GET: allow, HEAD: allow, POST: allow, PUT: allow, DELETE: allow, PATCH: allow }
}

export class PostgRESTResource<T, TSchema extends z.ZodType<T[]>> {
  url: string
  fields: string[]
  embeddedResources: Record<string, string[]>
  allowAnonymous: Record<string, boolean>
  additionalParams: ResourceAdditionalParams
  schema: TSchema

  constructor(config: PostgRESTResourceDescription<TSchema>) {
    const runtimeConfig = useRuntimeConfig()
    this.fields = config.fields
    if (typeof config.allowAnonymous == 'boolean') {
      this.allowAnonymous = defaultAllowAnonymous(config.allowAnonymous)
    } else {
      this.allowAnonymous = Object.assign(defaultAllowAnonymous(), config.allowAnonymous)
    }
    this.embeddedResources = config.embeddedResources ?? {}
    this.additionalParams = config.additionalParams ?? {} as ResourceAdditionalParams
    // this.paramValidator = TODO()
    this.schema = config.schema
    this.url = `${runtimeConfig.postgrestUrl}/${config.endpoint}`
    this.handle = this.handle.bind(this)
    this.getSingleItem = this.getSingleItem.bind(this)
  }

  computedFields(): string {
    let fields = this.fields.join(',')
    for (const [resource, resourceFields] of Object.entries(this.embeddedResources)) {
      // Embedded resources for one-to-many / many-to-many relationships are fetched
      // via a get request like `/select=field1,field2,resource(field1,field2)`
      fields += `,${resource}(${resourceFields.join(',')})`
    }
    return fields
  }

  // Check that the request either is authenticated or allows anonymous access, then
  // return the headers to be used in the PostgREST request
  getAuthenticatedHeaders(event: H3Event<EventHandlerRequest>): Record<string, string> {
    const headers = {
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    } as Record<string, string>

    const jwt = getCookie(event, 'session') ?? null
    if (jwt == null && !this.allowAnonymous[event.method]) {
      throw createError({ statusCode: 401, statusMessage: 'Unauthorized request' })
    } else if (jwt !== null) {
      headers['Authorization'] = `Bearer ${jwt}`
    }
    return headers
  }

  buildPostgRESTParams(event: H3Event<EventHandlerRequest>): URLSearchParams {
    const query = getQuery(event)
    const queryType = query?.['queryType'] as string ?? 'default'
    return new URLSearchParams([
      ['select', this.computedFields()],
      ...this.additionalParams?.[event.method]?.[queryType] ?? []
    ])
  }

  async handle(event: H3Event<EventHandlerRequest>): Promise<T[] | RequestError> {
    switch (event.method) {
      case 'GET':
        return await this.get(event)
      case 'POST':
        return await this.post(event)
      case 'PUT':
        return await this.put(event)
      case 'DELETE':
        return await this.delete(event)
      default:
        setResponseStatus(event, 405)
        return {
          statusCode: 405,
          message: 'Method not allowed'
        }
    }
  }

  async get(event: H3Event<EventHandlerRequest>): Promise<T[] | RequestError> {
    const headers = this.getAuthenticatedHeaders(event)
    const params = this.buildPostgRESTParams(event)
    return await $fetch<T[]>(`${this.url}?${params}`, {
      method: 'GET',
      headers
    })
  }

  async getSingleItem(event: H3Event<EventHandlerRequest>): Promise<T | RequestError> {
    const headers = this.getAuthenticatedHeaders(event)
    const params = this.buildPostgRESTParams(event)
    const id = event.context.params?.id
    params.append('id', `eq.${id}`)
    try {
      const [singleItem] = await $fetch<T[]>(`${this.url}?id=eq.${id}`, {
        method: 'GET',
        headers
      })
      if (singleItem) {
        return singleItem
      } else {
        throw new Error('Item not found')
      }
    } catch (error) {
      setResponseStatus(event, 404)
      return {
        statusCode: 404,
        message: error
      } as RequestError
    }
  }

  async post(event: H3Event<EventHandlerRequest>): Promise<T[] | RequestError> {
    const headers = this.getAuthenticatedHeaders(event)
    const body = await readValidatedBody(event, this.schema.parse)

    return await $fetch<T[]>(`${this.url}`, {
      method: 'POST',
      headers,
      body
    })
  }

  async put(event: H3Event<EventHandlerRequest>): Promise<T[] | RequestError> {
    const headers = this.getAuthenticatedHeaders(event)
    // Request that PostgREST upsert the records.
    headers['Prefer'] = 'return=representation, resolution=merge-duplicates'
    const body = await readValidatedBody(event, this.schema.parse)
    return await $fetch<T[]>(this.url, {
      method: 'POST',
      headers,
      body
    })
  }

  async delete(event: H3Event<EventHandlerRequest>): Promise<T[] | RequestError> {
    setResponseStatus(event, 501, 'Not implemented')
    return []
  }
}
