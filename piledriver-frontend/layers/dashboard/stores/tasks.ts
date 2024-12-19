import { defineStoreForResource } from '../utils/postgrest-resource-store'
import type { Task } from '~~/shared/types/tasks'

interface TaskStore {
  waiting: ComputedRef<Task[]>
  completed: ComputedRef<Task[]>
}

export const useTaskStore = defineStoreForResource<Task, TaskStore>('tasks', (rsc) => {
  // TODO: project filters
  const waiting = computed(() => rsc.items.value.filter(t => !t.completed_at))
  const completed = computed(() => rsc.items.value.filter(t => t.completed_at))

  return { waiting, completed }
})
