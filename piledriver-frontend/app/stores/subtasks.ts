import type { Reactive, ShallowRef } from 'vue'
import { defineStoreForResource } from '~/utils/postgrest-resource-store'
import { nowTemporal } from '~~/shared/utils/temporal-helpers'
import type { Subtask } from '~~/shared/types/tasks'

interface SubtaskStore {
  subtaskMap: Reactive<Map<UUID, ShallowRef<Subtask>[]>>
  getAndBuild: () => Promise<void>
  // updateCompletion: (subtask: Subtask, completed: boolean) => void
  addBlankSubtask: (subtask: Subtask) => void
}

export const useSubtaskStore = defineStoreForResource<Subtask, SubtaskStore>(
  'subtasks',
  (rsc) => {
    const { user } = useUserSession()

    // const requestFetch = useRequestFetch()
    const subtaskMap = reactive(new Map<UUID, Subtask[]>())

    const getAndBuild = async () => {
      await rsc.get({})
      subtaskMap.clear()

      for (const subtask of rsc.items.value) {
        const uuidKey: UUID = subtask.parent_subtask_id ?? subtask.task_id
        const sts = subtaskMap.get(uuidKey)
        if (sts !== undefined) {
          sts.push(subtask)
        } else {
          subtaskMap.set(uuidKey, [subtask])
        }
      }
    }

    const addBlankSubtask = (subtask: Subtask) => {
      rsc.items.value.push({
        task_id: subtask.task_id,
        parent_subtask_id: subtask.id,
        task_sheet_item_id: null,
        created_by: user?.user_id,
        routine_from: null,
        created_at: nowTemporal(),
        completed_at: null,
        archived_at: null,
        task_order: subtask.subtasks.length,
        title: ''
      })
    }
    return {
      subtaskMap,
      getAndBuild,
      addBlankSubtask
    }
  },
  {}
)
