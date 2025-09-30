import { defineStore } from 'pinia'
import { v7 as uuid } from 'uuid'
import type { Task } from '../../shared/types/database/tasks'
import type { Subtask } from '../../shared/types/database/subtasks'

const sortByOrder = (a: Subtask, b: Subtask) =>
  a.task_order < b.task_order
  ? -1
  : b.task_order - a.task_order

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
      if (st.parent_subtask_id !== null && m[st.parent_subtask_id]) {
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
        .map(st => st.task_order as number)
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

  /**
   * Reorder a subtask.
   *
   * @param move_subtask_id - The subtask to reorder.
   * @param move_new_order - The new order for the subtask
   * @param rearrange - Whether to move the subtask in the subtaskList. (i.e. sortable or no)
   */
  const reorderSubtask = async (move_subtask_id: string, move_new_order: number, rearrange: boolean) => {
    console.log('TODO: reorderSubtask')
    const { task_order: oldOrder, task_id, parent_subtask_id } = subtasks.value.find(st => st.id === move_subtask_id) as Subtask
    const parentID = parent_subtask_id ?? task_id

    const response = await $fetch<ReorderSubtaskResult[]>('/api/reorder/subtask', {
      method: 'POST',
      body: {
	move_subtask_id,
	move_new_order
      }
    })

    const updates: Record<string, number> = Object.fromEntries(
      response.map(({ subtask_id, updated_order }) => [subtask_id, updated_order])
    )
    for (const [i, subtask] of subtasks.value.entries()) {
      if (updates[subtask.id]) {
	subtasks.value[i].task_order = updates[subtask.id] as number
      }
    }

    for (const [i, subtask] of mapping.value[parentID].entries()) {
      if (updates[subtask.id]) {
	mapping.value[parentID][i].task_order = updates[subtask.id] as number
      }
    }
    if (rearrange) {
      const [movedSubtask] = mapping.value[parentID].splice((oldOrder as number) - 1, 1)
      mapping.value[parentID].splice(move_new_order - 1, 0, movedSubtask as Subtask)
    }
  }

  /** Save a subtask (does not consider chained completion) */
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

  /** Archive a subtask and remove it from the dashboard. */
  const archiveSubtask = async (archiveSubtask: Subtask) => {
    if (!unsavedSubtaskIDs.value.has(archiveSubtask.id)) {
      const response = await $fetch<ArchiveSubtaskResult[]>(`/api/subtasks?archive_subtask_id=${archiveSubtask.id}`, {
	method: 'DELETE'
      })

      const updates: Record<string, ArchiveSubtaskResult> = Object.fromEntries(
	response.map(asr => [asr.subtask_id, asr])
      )

      // Update subtask master list.
      for (const [i, subtask] of subtasks.value.entries()) {
	if (updates[subtask.id]) {
	  subtasks.value[i].task_order = updates[subtask.id].updated_order

	  if (subtask?.id && subtasks.value[i] && updates[subtask.id]?.updated_archived_at) {
	    subtasks.value[i].archived_at = new Date(updates[subtask.id]?.updated_archived_at as string)
	  } else {
	    // ooooo typescript, you make me so frustrated sometimes...
	    (subtasks.value[i] as Subtask).archived_at = null
	  }
	}
      }

      const i = subtasks.value.findIndex(st => st.id === archiveSubtask.id)
      subtasks.value.splice(i, 1)

      // Update the list of child subtasks.
      const parent_id = archiveSubtask.parent_subtask_id ?? archiveSubtask.task_id
      if (mapping.value[parent_id]) {
	for (const [i, subtask] of mapping.value[parent_id].entries()) {
	  if (updates[subtask.id]) {
	    mapping.value[parent_id][i].task_order = updates[subtask.id].updated_order
	    mapping.value[parent_id][i].archived_at = updates[subtask.id].updated_archived_at
	  }
	}

	const mi = mapping.value[parent_id].findIndex(st => st.id === archiveSubtask.id)
	mapping.value[parent_id].splice(mi, 1)
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
    reorderSubtask,
    saveSubtask,
    archiveSubtask
  }
})
