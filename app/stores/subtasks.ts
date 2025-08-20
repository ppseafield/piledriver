import { defineStore } from 'pinia'
import { v7 as uuid } from 'uuid'
import type { Subtask } from '../../shared/types/database/subtasks'

export const useSubtasksStore = defineStore('subtasks', () => {
  const subtasks = ref<Subtask[]>([])
  const mapping = ref<Record<string, Subtask[]>>({})
  const unsavedSubtaskIDs = ref<Set<string>>(new Set())

  const reorder = reactive({
    open: false,
    task: null as Task | null,
    subtask: null as Subtask | null
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

  /** Add an empty subtask to a task's subtask list. */
  const addEmptySubtask = async (task_id: string) => {
    // TODO: nested subtasks
    const { user } = useUserSession()
    const now = new Date()
    const task_order = Math.max(
      0,
      ...subtasks.value
        .filter(st => st.task_id === task_id)
        .map(st => st.task_order)
    ) + 1
    const empty = {
      id: uuid(),
      user_id: (user.value?.id) as string,
      task_id,
      parent_subtask_id: null,
      created_at: now,
      updated_at: now,
      completed_at: null,
      archived_at: null,
      task_order,
      title: ''
    }
    subtasks.value.push(empty)
    if (mapping.value[task_id]) {
      mapping.value[task_id].push(empty)
    } else {
      mapping.value[task_id] = [empty]
    }
    // Flag this one as a new (unsaved) subtask
    unsavedSubtaskIDs.value.add(empty.id)
  }

  /** Save a subtask (does not consider completion) */
  const saveSubtask = async (subtask: Subtask) => {
    const method = unsavedSubtaskIDs.value.has(subtask.id) ? 'POST' : 'PUT'
    const updatedSubtask = await $fetch<Subtask[]>('/api/subtasks', {
      method,
      body: [subtask]
    })
    if (updatedSubtask?.[0]) {
      const updated = updatedSubtask[0]
      const si = subtasks.value.findIndex(st => st.id === subtask.id)
      Object.assign(subtasks.value[si], updated)
      const parent_id = subtask.parent_subtask_id ?? subtask.task_id
      const mi = mapping.value[parent_id].findIndex(st => st.id === subtask.id)
      Object.assign(mapping.value[parent_id], updated)

      if (method === 'POST') {
	unsavedSubtaskIDs.value.delete(subtask.id)
      }
    }
  }

  return {
    subtasks,
    reorder,
    unsavedSubtaskIDs,
    mapping,

    fetch,
    addEmptySubtask,
    saveSubtask
  }
})
