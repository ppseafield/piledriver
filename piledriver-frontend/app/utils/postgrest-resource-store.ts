import type { ShallowRef } from 'vue'
import type { StoreDefinition } from 'pinia'

interface HasID {
  id?: UUID
}

export interface ResourceStoreCore<T extends HasID> {
  items: ShallowRef<T[]>
  currentItem: ShallowRef<T | null>
  selectItem: (item: T | null) => void
  get: (filters: string[]) => Promise<void>
  post: (items: T[]) => Promise<void>
  put: (items: T[]) => Promise<void>
  archive: (items: T[]) => Promise<void>
}

type ResourceStore<T extends HasID, E> = ResourceStoreCore<T> & E

export function defineStoreForResource<T extends HasID, E>(endpoint: string, extend: (rsc: ResourceStoreCore<T>) => E): StoreDefinition {
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
          Object.assign(items.value[index], response[index])
        }
      }
      triggerRef(items)
    }

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
    const put = async (itemsToUpdate: T[]) => {
      const response = await requestFetch<T[]>(`/api/${endpoint}`, {
        method: 'PUT',
        body: itemsToUpdate
      })
      updateItemsFromResponse(response)
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

    const store: ResourceStoreCore<T> = { items, currentItem, selectItem, get, post, put, archive }
    return {
      ...store,
      ...(extend(store))
    } as ResourceStore<T, E>
  })
}
