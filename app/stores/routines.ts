import { defineStore } from 'pinia'
import { v7 as uuid } from 'uuid'
import type { Routine } from '@@/shared/types/database/routines'
import type { RoutineSubtask } from '@@/shared/types/database/routine_subtasks'

interface RoutineSingle {
  routine: Routine
  subtasks: RoutineSubtask[]
}

export const useRoutineStore = defineStore('routines', () => {
  const routines = ref<Routine[]>([])
  const current = ref<Routine | null>(null)
  const relatedSubtasks = ref<RoutineSubtask[]>([])
  const unsavedSubtaskIDs = ref<Set<string>>(new Set())

  const fetch = async () => {
    const requestFetch = useRequestFetch()
    const response = await requestFetch<Routine[]>('/api/routines')
    routines.value = response
  }

  const fetchSingle = async (id: string) => {
    const requestFetch = useRequestFetch()
    const { routine, subtasks } = await requestFetch<RoutineSingle>(`/api/routines/${id}`)

    current.value = routine
    relatedSubtasks.value = subtasks
  }

  const addEmptySubtask = (routine_id: string) => {
    const { user } = useUserSession()
    const now = nowTemporal()
    const task_order = Math.max(
      0,
      ...relatedSubtasks.value
        .map(rst => rst.task_order as number)
    ) + 1

    const empty: RoutineSubtask = {
      id: uuid(),
      user_id: user.value?.id as string,
      routine_id,
      created_at: now,
      updated_at: now,
      archived_at: null,
      task_order,
      title: ''
    }
    relatedSubtasks.value.push(empty)
    unsavedSubtaskIDs.value.add(empty.id)
  }

  /**
   * Reorder a subtask.
   *
   * @param move_routine_subtask_id - The subtask to reorder.
   * @param move_new_order - The new order for the subtask
   * @param rearrange - Whether to move the subtask in the subtaskList. (i.e. sortable or no)
   */
  const reorderSubtask = async (move_routine_subtask_id: string, move_new_order: number, rearrange: boolean) => {
    const { task_order: oldOrder } = relatedSubtasks.value.find(rst => rst.id === move_routine_subtask_id)
    // TODO: when nested subtasks appear, allow nesting here too.

    const response = await $fetch<ReorderRoutineSubtaskResult[]>('/api/reorder/routine_subtask', {
      method: 'POST',
      body: {
	move_routine_subtask_id,
	move_new_order
      }
    })

    const updates: Record<string, number> = Object.fromEntries(
      response.map(({ routine_subtask_id, updated_order }) => [routine_subtask_id, updated_order])
    )

    for (const [i, rst] of relatedSubtasks.value.entries()) {
      if (updates[rst.id]) {
	relatedSubtasks.value[i].task_order = updates[rst.id] as number
      }
    }

    if (rearrange) {
      const [movedRST] = relatedSubtasks.value.splice(oldOrder - 1, 1)
      relatedSubtasks.value.splice(move_new_order -1, 0, movedRST as RoutineSubtask)
    }
  }

  const saveSubtask = async (routine_subtask: RoutineSubtask) => {
    const method = unsavedSubtaskIDs.value.has(routine_subtask.id) ? 'POST': 'PUT'
    const updatedRST = await $fetch('/api/routine_subtasks', {
      method,
      body: [routine_subtask]
    })
    if (updatedRST?.[0]) {
      const updated = updatedRST[0]
      const i = relatedSubtasks.value.findIndex(rst => rst.id === updated.id)
      Object.assign(relatedSubtasks.value[i], updated)
    }
    if (method === 'POST') {
      unsavedSubtaskIDs.value.delete(routine_subtask.id)
    }
  }

  const archiveSubtask = async (archive_routine_subtask_id: string) => {
    const response = await $fetch<ArchiveRoutineSubtaskResult>(`/api/routine_subtasks?archive_routine_subtask_id=${archive_routine_subtask_id}`, {
      method: 'DELETE'
    })

    const updates: Record<string, ArchiveRoutineSubtaskResult> = Object.fromEntries(
      response.map(arst => [arst.id, arst])
    )
    let archivedIndex = null
    for (const [i, rst] of relatedSubtasks.value.entries()) {
      if (updates[rst.id]) {
	relatedSubtasks.value[i].task_order = updates[rst.id].task_order
	relatedSubtasks.value[i].archived_at = updates[rst.id].archived_at
	if (updates[rst.id].archived_at !== null) {
	  archivedIndex = i
	}
      }
    }
    if (archivedIndex !== null) {
      relatedSubtasks.value.splice(archivedIndex, 1)
    }
  }

  return {
    routines,
    current,
    relatedSubtasks,
    unsavedSubtaskIDs,

    fetch,
    fetchSingle,
    addEmptySubtask,
    reorderSubtask,
    saveSubtask,
    archiveSubtask
  }
})

