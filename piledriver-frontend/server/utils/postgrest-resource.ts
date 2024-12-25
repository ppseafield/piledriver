import type { H3Event, EventHandlerRequest, HTTPMethod } from 'h3'
import type { z } from 'zod'

interface RequestError {
  statusCode: number
  message: string
}

interface PostgRESTResourceDescription<TSchema> {
  endpoint: string
  fields: string[]
  allowAnonymous: boolean | Record<HTTPMethod, boolean>
  embeddedResources: Record<string, string[]>
  additionalParams?: Partial<Record<HTTPMethod, string[][]>>
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
  additionalParams: Partial<Record<HTTPMethod, string[][]>>
  schema: TSchema

  constructor(config: PostgRESTResourceDescription<TSchema>) {
    const runtimeConfig = useRuntimeConfig()
    this.fields = config.fields
    if (typeof config.allowAnonymous == 'boolean') {
      this.allowAnonymous = defaultAllowAnonymous(config.allowAnonymous)
    } else {
      this.allowAnonymous = Object.assign(defaultAllowAnonymous(), config.allowAnonymous)
    }
    this.embeddedResources = config.embeddedResources
    //                                                          typescript, infer thy self!
    this.additionalParams = config.additionalParams ?? ({ GET: ([] as string[][]) } as Record<HTTPMethod, string[][]>)
    this.schema = config.schema
    this.url = `${runtimeConfig.postgrestUrl}/${config.endpoint}`
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
    const params = new URLSearchParams([
      ['select', this.computedFields()],
      ...(this.additionalParams.GET ?? [])
    ])
    return await $fetch<T[]>(`${this.url}?${params}`, {
      method: 'GET',
      headers
    })
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
