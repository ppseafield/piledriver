import { defineStore } from 'pinia'
import { v7 as uuid } from 'uuid'
import type { Subtask } from '../../shared/types/database/subtasks'

export const useSubtasksStore = defineStore('subtasks', () => {
  const subtasks = ref<Subtask[]>([])
  const mapping = ref<Record<string, Subtask[]>>({})

  const reorder = reactive({
    open: false,
    task: null as Task | null
  })

  /** Fetches the dashboard's tasks. */
  const fetch = async () => {
    const requestFetch = useRequestFetch()
    const response = await requestFetch<Subtask[]>('/api/subtasks')
    subtasks.value = response
    const m = {}
    for (const st of response) {
      if (m[st.parent_subtask_id]) {
	m[st.parent_subtask_id].push(st)
      } else if (m[st.task_id]) {
	m[st.task_id].push(st)
      } else {
	m[st.parent_subtask_id ?? st.task_id] = [st]
      }
    }
    mapping.value = m
  }

  return {
    subtasks,
    reorder,
    mapping,

    fetch
  }
})
