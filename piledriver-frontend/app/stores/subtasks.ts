import { defineStoreForResource } from '~/utils/postgrest-resource-store'
import { nowTemporal } from '~~/shared/utils/temporal-helpers'
import type { Subtask } from '~~/shared/types/tasks'
import { useSessionStore } from '~~/layers/auth/stores/session'

interface SubtaskStore {
  // updateCompletion: (subtask: Subtask, completed: boolean) => void
  addBlankSubtask: (subtask: Subtask) => void
}

export const useSubtaskStore = defineStoreForResource<Subtask, SubtaskStore>(
  'subtasks',
  (rsc) => {
    const session = useSessionStore()

    const requestFetch = useRequestFetch()

    const addBlankSubtask = (subtask: Subtask) => {
      rsc.items.value.push({
        task_id: subtask.task_id,
        parent_subtask_id: subtask.id,
        task_sheet_item_id: null,
        created_by: session.user?.user_id,
        routine_from: null,
        created_at: nowTemporal(),
        completed_at: null,
        archived_at: null,
        task_order: subtask.subtasks.length,
        title: ''
      })
    }
    return {
      addBlankSubtask
    }
  },
  {}
)
