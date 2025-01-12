import type { ShallowRef } from 'vue'
import type { StoreDefinition } from 'pinia'

interface HasID {
  id?: UUID
}
// optional paramaters for resource stores
export interface ResourceStoreOptional<T> {
  // sort by this after get/put/post
  sortItems?: (a: T, b: T) => number
  // get items ready to send to the server
  prepare?: (item: T[]) => T[]
  // process the items after requests
  mapResponse?: (response: T[]) => T[]
}

export interface StoreRequestOptions {
  queryType?: string
  params?: URLSearchParams
  append?: boolean
}

export interface ResourceStoreCore<T extends HasID> extends ResourceStoreOptional<T> {
  items: ShallowRef<T[]>
  currentItem: ShallowRef<T | null>
  selectItem: (item: T | null) => void
  get: (options: StoreRequestOptions | undefined) => Promise<void>
  post: (items: T[]) => Promise<T[]>
  put: (items: T[]) => Promise<T[]>
  archive: (items: T[]) => Promise<void>
  updateAtIndex: (index: number, item: T) => void
  ensureCurrent: (id: UUID) => Promise<void>
}

type ResourceStore<T extends HasID, E> = ResourceStoreCore<T> & E

export function defineStoreForResource<T extends HasID, E>(
  endpoint: string,
  extend: (rsc: ResourceStoreCore<T>) => E,
  optional: ResourceStoreOptional<T> = {}
): StoreDefinition {
  return defineStore<string, ResourceStore<T, E>>(endpoint, () => {
    const items = shallowRef<T[]>([])

    const currentItem: ShallowRef<T | null> = shallowRef<T | null>(null)
    const selectItem = (item: T | null) => {
      currentItem.value = item
    }
    const updateItemsFromResponse = (response: T[]) => {
      for (const item of items.value) {
        const index = response.findIndex(i => i.id === item.id)
        if (index !== -1 && items.value[index] !== undefined) {
          console.log('updating item:', { ...items.value[index] }, ' with: ', response[index])
          Object.assign(item, response[index])
        }
      }
      if (optional.sortItems) {
        items.value.sort(optional.sortItems)
      }
      triggerRef(items)
    }
    const updateAtIndex = (index: number, item: T) => {
      const i = index < 0 ? items.value.length + index : index
      items.value[i] = item
      triggerRef(items)
    }

    const requestFetch = useRequestFetch()

    const get = async (options: StoreRequestOptions | undefined) => {
      const params = options?.params ?? new URLSearchParams()
      if (options?.queryType) {
        params.append('queryType', options.queryType)
      }
      const url = `/api/${endpoint}${params}`
      const response = await requestFetch<T[]>(url)
      if (response !== undefined && response !== null) {
        const mappedResponse = optional.mapResponse ? optional.mapResponse(response) : response
        if (options?.append) {
          items.value.push(...mappedResponse)
        } else {
          items.value = mappedResponse
        }
      } else {
        // TODO handle error
        items.value = []
      }
      if (optional.sortItems) {
        items.value.sort(optional.sortItems)
      }
      triggerRef(items)
    }

    const post = async (itemsToCreate: T[]): Promise<T[]> => {
      const response = await requestFetch<T[]>(`/api/${endpoint}`, {
        method: 'POST',
        body: optional.prepare ? optional.prepare(itemsToCreate) : itemsToCreate
      })
      // TODO: some way to update items inline (the don't have ids yet)
      // items.value.push(...mappedResponse)
      // items.value.sort(optional.sortItems)
      // triggerRef(items)
      return (optional.mapResponse ? optional.mapResponse(response) : response) as T[]
    }

    const put = async (itemsToUpdate: T[]): Promise<T[]> => {
      const response = await requestFetch<T[]>(`/api/${endpoint}`, {
        method: 'PUT',
        body: itemsToUpdate
      })
      const mapped: T[] = optional.mapResponse ? optional.mapResponse(response) : response
      updateItemsFromResponse(mapped)
      return mapped
    }

    const archive = async (itemsToDelete: T[]) => {
      const response = await requestFetch<T[]>(`/api/${endpoint}`, {
        method: 'DELETE',
        body: itemsToDelete
      })
      const removedIDs = response.map(i => i.id)
      items.value = items.value.filter(i => !removedIDs.includes(i?.id))
    }
    const ensureCurrent = async (id: UUID) => {
      currentItem.value = null
      const item = items.value.find(i => i.id === id)
      if (item) {
        currentItem.value = item
      } else {
        // TODO: fetch the item and set current to it
        const response = await get({
          params: new URLSearchParams([['id', `eq.${id}`]]),
          append: true
        })
        currentItem.value = response?.[0] ?? null
      }
    }

    const store: ResourceStoreCore<T> = {
      items,
      currentItem,
      selectItem,
      get,
      post,
      put,
      archive,
      updateAtIndex,
      ensureCurrent
    }
    return {
      ...store,
      ...(extend(store))
    } as ResourceStore<T, E>
  })
}
