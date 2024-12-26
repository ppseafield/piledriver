import { defineStoreForResource } from '~/utils/postgrest-resource-store'
import { nowTemporal } from '~~/shared/utils/temporal-helpers'
import type { Task } from '~~/shared/types/tasks'

interface TaskStore {
  waiting: ComputedRef<Task[]>
  completed: ComputedRef<Task[]>
  updateCompletion: (task: Task) => void
  addTask: (created_by: UUID) => void
  removeTask: (task: Task) => void
}

export const useTaskStore = defineStoreForResource<Task, TaskStore>('tasks', (rsc) => {
  // TODO: project filters
  const waiting = computed(() => rsc.items.value.filter(t => !t.completed_at))
  const completed = computed(() => rsc.items.value.filter(t => t.completed_at))

  const updateCompletion = (task: Task) => {
    console.log('todo: updateCompletion', task)
  }

  const addTask = (created_by: UUID) => {
    rsc.items.value.push({
      created_by,
      journaled_by: null,
      routine_from: null,
      created_at: nowTemporal(),
      completed_at: null,
      archived_at: null,
      title: ''
    })
    triggerRef(rsc.items)
  }

  const removeTask = (task: Task) => {
    if (task.id === undefined) {
      rsc.items.value = rsc.items.value.filter(t => t.id !== undefined)
    } else {
      console.log('todo: remove task', task)
    }
  }

  return {
    waiting,
    completed,
    updateCompletion,
    addTask,
    removeTask
  }
})
