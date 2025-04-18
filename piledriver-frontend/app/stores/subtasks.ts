import type { Reactive } from 'vue'
import { defineStoreForResource } from '~/utils/postgrest-resource-store'
import { nowTemporal } from '~~/shared/utils/temporal-helpers'
import type { Subtask, SubtaskCompletion, Task } from '~~/shared/types/tasks'

interface SubtaskStore {
  subtaskMap: Record<UUID, Reactive<Subtask[]>>
  getAndBuild: () => Promise<void>
  updateCompletion: (subtask: Subtask, completed: boolean) => Promise<void>
  addBlankSubtask: (subtask: Partial<Subtask>, task_order?: number) => void
  getSubtasks: (task_id: UUID) => ComputedRef<Subtask[]> | null
  removeSubtask: (subtask: Subtask) => Promise<void>
}

export const useSubtaskStore = defineStoreForResource<Subtask, SubtaskStore>(
  'subtasks',
  (rsc) => {
    // const requestFetch = useRequestFetch()
    const subtaskMap = reactive<Record<UUID, Reactive<Subtask[]>>>({})

    const getAndBuild = async () => {
      await rsc.get({})
      // clear array
      for (const sts of Object.values(subtaskMap)) {
        sts.splice(0, sts.length)
      }

      for (const subtask of rsc.items.value) {
        // Keys are a mix of subtask and task ids so that all child relationships are present.
        const uuidKey: UUID = subtask.parent_subtask_id ?? subtask.task_id
        const sts = subtaskMap[uuidKey]
        if (sts) {
          sts.push(subtask)
        } else {
          subtaskMap[uuidKey] = reactive<Subtask[]>([subtask])
        }
      }
    }

    const getSubtasks = (task_id: UUID): ComputedRef<Subtask[]> | null => {
      return computed(() => rsc.items.value.filter((st: Subtask) => st.task_id === task_id))
    }

    const addBlankSubtask = (subtask: Partial<Subtask>, task_order?: number) => {
      const { user } = useUserSession()
      console.log('user', user)
      const newSubtask = {
        task_id: subtask.task_id,
        parent_subtask_id: subtask.id,
        task_sheet_item_id: null,
        created_by: user?.value?.user_id,
        routine_from: null,
        created_at: nowTemporal(),
        completed_at: null,
        archived_at: null,
        task_order: task_order ?? subtask?.subtasks?.length ?? 0,
        title: ''
      }
      console.log('subtask big list:', rsc.items.value)
      console.log('rsc.items.value is an array?', Array.isArray(rsc.items.value))
      rsc.items.value.push(newSubtask)
      triggerRef(rsc.items)
      // subtaskMap[subtask.task_id].push(newSubtask)
    }
    const findTopmostParent = (subtask: Subtask): UUID => {
      console.log('subtask:', subtask)
      console.log('subtaskMap', subtaskMap)
      console.log('subtask id:', subtask.id)
      const now = nowTemporal()
      if (subtask.parent_subtask_id === null) {
        // TODO: Task may also be done! Handle this too.
        return subtask.id
      } else {
        const siblings = subtaskMap[subtask.parent_subtask_id]
        console.log('siblings:', siblings)
        if (siblings === undefined) {
          return subtask.id
        } else {
          for (const st of siblings) {
            console.log('st:', st)
            if (st.id === subtask.id) {
              st.completed_at = now
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
      const id = subtask.id
      /* if (completed) {
        id = findTopmostParent(subtask)
        console.log('had to look upwards for id:', id)
      } */

      const response = await $fetch<SubtaskCompletion[]>('/api/update-subtask-completion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: { subtask_id: id, completed }
      })
      const updatedSubtasks: Record<UUID, Timestamp | null> = Object.fromEntries(
        response.map(({ st_id, new_completed }) => [st_id, new_completed])
      )
      // Update the store subtasks
      /* const t = useTaskStore()
      const parentTask = t.items.find((task: Task) => task.id === subtask.task_id)
      const siblings = [] */
      for (const item of rsc.items.value) {
        if (updatedSubtasks[item.id]) {
          item.completed_at = updatedSubtasks[item.id]
          // TODO: not important for now, will matter when nesting subtasks is allowed.
          /* if (item.parent_subtask_id !== null) {
            const siblings = subtaskMap[item.parent_subtask_id]
            if (siblings) {
              siblings.forEach((st: Subtask) => {
                if (st.id === item.id) {
                  st.completed_at = updatedSubtasks[item.id]
                }
              })
            }
          } */
        }
        /* if (item.task_id === parentTask.id) {
          siblings.push(item)
        } */
      }
      /*
      console.log('siblings:', siblings)
      if (siblings.every((st: Subtask) => st.completed_at !== null)) {
        console.log('all complete')
        // await t.updateCompletion(parentTask, true)
      } else if (siblings.some((st: Subtask) => st.completed_at === null)) {
        console.log('not all complete')
        // await t.updateCompletion(parentTask, false)
      } */
      triggerRef(rsc.items)
    }

    const removeSubtask = async (subtask: Subtask): Promise<void> => {
      await rsc.put([
        {
          ...subtask,
          archived_at: nowTemporal()
        }
      ])
      // Remove subtask from the list of all subtasks.
      rsc.items.value = rsc.items.value.filter(item => item.id !== subtask.id)
      triggerRef(rsc.items)
      // Remove subtask from its list of sibilings in the subtaskMap.
      const parentID = subtask?.parent_subtask_id || subtask.task_id
      const i = subtaskMap[parentID].findIndex((st: Subtask) => st.id === subtask.id)
      subtaskMap[parentID].splice(i, 1)
      // TODO: update subtask ordering
    }

    return {
      subtaskMap,
      getAndBuild,
      updateCompletion,
      addBlankSubtask,
      getSubtasks,
      removeSubtask
    }
  },
  {}
)
