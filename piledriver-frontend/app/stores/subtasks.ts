import type { Reactive, ShallowRef } from 'vue'
import { defineStoreForResource } from '~/utils/postgrest-resource-store'
import { nowTemporal } from '~~/shared/utils/temporal-helpers'
import type { Subtask, SubtaskCompletion } from '~~/shared/types/tasks'

interface SubtaskStore {
  subtaskMap: Reactive<Map<UUID, ShallowRef<Subtask>[]>>
  getAndBuild: () => Promise<void>
  updateCompletion: (subtask: Subtask, completed: boolean) => Promise<void>
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
        // Keys are a mix of subtask and task ids so that all child relationships are present.
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
    const findTopmostParent = (subtask: Subtask): UUID => {
      console.log('subtaskMap', subtaskMap)
      console.log('subtask id:', subtask.id)
      if (subtask.parent_subtask_id === null) {
        // TODO: Task may also be done! Handle this too.
        return subtask.id
      } else {
        const siblings = subtaskMap.get(subtask.parent_subtask_id)
        if (siblings === undefined) {
          return subtask.id
        } else {
          for (const st of siblings) {
            if (st.id === subtask.id) {
              st.completed_at = nowTemporal()
            }
          }
          // Because completion can cascade upwards, we need to find the topmost parent id.
          if (siblings.every((st: Subtask) => st.completed_at !== null)) {
            return findTopmostParent(
              rsc.items.value.find(
                (st: Subtask) => st.id === subtask.parent_subtask_id
              )
            )
          } else {
            return subtask.id
          }
        }
      }
    }

    const updateCompletion = async (subtask: Subtask, completed: boolean) => {
      let id = subtask.id
      if (completed) {
        id = findTopmostParent(subtask)
        console.log('had to look upwards for id:', id)
      }
      console.log('id:', id)
      const response = await $fetch<SubtaskCompletion[]>('/api/update-subtask-completion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: { subtask_id: id, completed }
      })
      const updatedSubtasks = Object.fromEntries(
        response.map(({ st_id, new_completed }) => [st_id, new_completed])
      )
      // Update the store subtasks
      for (const item of rsc.items.value) {
        if (updatedSubtasks[item.id]) {
          item.completed_at = updatedSubtasks[item.id]
          if (item.parent_subtask_id !== null) {
            const siblings = subtaskMap.get(item.parent_subtask_id)
            if (siblings) {
              siblings.forEach((st: Subtask) => {
                if (st.id === item.id) {
                  st.completed_at = updatedSubtasks[item.id]
                }
              })
            }
          }
        }
      }
      triggerRef(rsc.items)
    }

    return {
      subtaskMap,
      getAndBuild,
      updateCompletion,
      addBlankSubtask
    }
  },
  {}
)
