import type { H3Event, EventHandlerRequest, HTTPMethod } from 'h3'

interface RequestError {
  statusCode: number
  message: string
}

interface PostgRESTResourceDescription<TSchema> {
  endpoint: string
  fields: string[]
  allowAnonymous: boolean | Record<HTTPMethod, boolean>
  embeddedResources: Record<string, string[]>
  validator: TSchema
}

function defaultAllowAnonymous(allow: boolean = false) {
  return { GET: allow, HEAD: allow, POST: allow, PUT: allow, DELETE: allow, PATCH: allow }
}

export class PostgRESTResource<T, TSchema> {
  url: string
  fields: string[]
  embeddedResources: Record<string, string[]>
  allowAnonymous: Record<string, boolean>
  validator: TSchema

  constructor(config: PostgRESTResourceDescription<TSchema>) {
    const runtimeConfig = useRuntimeConfig()
    this.fields = config.fields
    if (typeof config.allowAnonymous == 'boolean') {
      this.allowAnonymous = defaultAllowAnonymous(config.allowAnonymous)
    } else {
      this.allowAnonymous = Object.assign(defaultAllowAnonymous(), config.allowAnonymous)
    }
    this.embeddedResources = config.embeddedResources
    this.validator = config.validator
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

  async handle(event: H3Event<EventHandlerRequest>): Promise<T[] | RequestError> {
    console.log('Got request to path:', event.path)
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
    const jwt = getCookie(event, 'session') ?? null
    if (jwt == null && !this.allowAnonymous.GET) {
      setResponseStatus(event, 401)
      return {
        statusCode: 401,
        message: 'Unauthorized request'
      }
    }
    const params = new URLSearchParams([
      ['select', this.computedFields()]
    ])
    return await $fetch<T[]>(`${this.url}?${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Prefer': 'return=representation',
        'Authorization': `Bearer ${jwt}`
      }
    }).catch((e) => {
      return {
        statusCode: e.statusCode,
        message: e.message
      }
    })
  }

  async post(event: H3Event<EventHandlerRequest>): Promise<T[] | RequestError> {
    setResponseStatus(event, 501, 'Not implemented')
    return []
  }

  async put(event: H3Event<EventHandlerRequest>): Promise<T[] | RequestError> {
    setResponseStatus(event, 501, 'Not implemented')
    return []
  }

  async delete(event: H3Event<EventHandlerRequest>): Promise<T[] | RequestError> {
    setResponseStatus(event, 501, 'Not implemented')
    return []
  }
}
