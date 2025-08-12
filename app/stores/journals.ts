import { defineStore } from 'pinia'
import { v7 as uuid } from 'uuid'
import type { Task } from '../../shared/types/database/tasks'

interface JournalSingle {
  journal: Journal
  tasks: Task[]
}

export const useJournalStore = defineStore('journal', () => {
  const journals = ref<Journal[]>([])
  const current = ref<Journal | null>(null)
  const relatedTasks = ref<Tasks[]>([])

  /** Fetches the dashboard's tasks. */
  const fetch = async () => {
    const requestFetch = useRequestFetch()
    const response = await requestFetch<Task[]>('/api/journals')
    journals.value = response
  }

  /** Fetch a single journal and its tasks */
  const fetchSingle = async (id: string) => {
    const requestFetch = useRequestFetch()
    const { journal, tasks } = await requestFetch<JournalSingle>(`/api/journals/${id}`)
    current.value = journal
    relatedTasks.value = tasks
  }

  /** create a journal */
  const create = async (j: NewJournalSchema) => {
    const requestFetch = useRequestFetch()
    const response = await requestFetch<JournalCreateResponse>('/api/journals', {
      method: 'POST',
      body: j
    })
    return response.journal
  }

  const update = async (j: JournalUpdate) => {
    const requestFetch = useRequestFetch()
    const response = await requestFetch<Journal>('/api/journals', {
      method: 'PUT',
      body: j
    })
    // TODO: update journals list
    if (current.value.id === j.id) {
      current.value = { ...current.value, ...response }
    }
    return response
  }

  return {
    journals,
    current,
    relatedTasks,

    fetch,
    fetchSingle,
    create,
    update
  }
})
