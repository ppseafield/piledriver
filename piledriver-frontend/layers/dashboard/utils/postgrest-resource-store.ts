import type { ShallowRef } from 'vue'
import type { StoreDefinition } from 'pinia'

export interface ResourceStoreCore<T> {
  items: ShallowRef<T[]>
  currentItem: ShallowRef<T | null>
  currentError: ShallowRef<Error | null>
  get: (filters: string[]) => Promise<void>
  post: (items: T[]) => Promise<void>
  put: (items: T[]) => Promise<void>
  archive: (items: T[]) => Promise<void>
}

type ResourceStore<T, E> = ResourceStoreCore<T> & E

export function defineStoreForResource<T, E>(endpoint: string, extend: (rsc: ResourceStoreCore<T>) => E): StoreDefinition {
  return defineStore<string, ResourceStore<T, E>>(endpoint, () => {
    const items = shallowRef<T[]>([])
    const currentItem = shallowRef<T | null>(null)
    const currentError = shallowRef<Error | null>(null)

    const requestFetch = useRequestFetch()
    const get = async (filters: string[]) => {
      console.log('filters todo:', filters)
      const response = await requestFetch<T[]>(`/api/${endpoint}`).catch(e => console.log('error:', e))
      if (response !== undefined && response !== null) {
        items.value = response
      } else {
        // TODO handle error
        items.value = []
      }
    }
    const post = async (items: T[]) => {
      // TODO: move to useFetch
      const response = await $fetch<T[]>(`/api/${endpoint}`, {
        method: 'POST',
        body: JSON.stringify(items)
      })
      // TODO update items inline
      console.log('posted items:', response)
    }
    const put = async (items: T[]) => {
      // TODO: move to useFetch
      const response = await $fetch<T[]>(`/api/${endpoint}`, {
        method: 'PUT',
        body: JSON.stringify(items)
      })
      // TODO update items inline
      console.log('put items:', response)
    }
    const archive = async (items: T[]) => {
      // TODO: move to useFetch
      const response = await $fetch<T[]>(`/api/${endpoint}`, {
        method: 'DELETE',
        body: items
      })
      // TODO update items inline
      console.log('archived items:', response)
    }

    const store: ResourceStoreCore<T> = { items, currentItem, currentError, get, post, put, archive }
    return {
      ...store,
      ...(extend(store))
    } as ResourceStore<T, E>
  })
}
