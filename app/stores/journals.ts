import { defineStore } from 'pinia'
import { v7 as uuid } from 'uuid'
import type { Task } from '../../shared/types/database/tasks'

export const useJournalStore = defineStore('journal', () => {
  const journals = ref<Journal[]>([])
  const current = ref<Journal | null>(null)

  /** Fetches the dashboard's tasks. */
  const fetch = async () => {
    const requestFetch = useRequestFetch()
    const response = await requestFetch<Task[]>('/api/journals')
    journals.value = response
  }

  export default {
    journals,
    current,

    fetch
  }
})
