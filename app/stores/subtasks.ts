import { defineStore } from 'pinia'
import { v7 as uuid } from 'uuid'
import type { Subtask } from '../../shared/types/database/subtasks'

export const useSubtasksStore = defineStore('subtasks', () => {
  const subtasks = ref<Subtask[]>([])

  const reorder = reactive({
    open: false,
    task: null as Task | null
  })

  /** Fetches the dashboard's tasks. */
  const fetch = async () => {
    const requestFetch = useRequestFetch()
    const response = await requestFetch<Subtask[]>('/api/subtasks')
    subtasks.value = response
  }

  return {
    subtasks,
    reorder,

    fetch
  }
})
