import type { ShallowRef } from 'vue'
import type { Task } from '~~/shared/types/tasks'
import type { Journal } from '~~/shared/types/journal'

interface TaskStore {
  unjournaledTasks: ShallowRef<Task[]>
  fetchUnjournaledTasks: () => Promise<void>
}

export const useJournalStore = defineStoreForResource<Journal, TaskStore>(
  'journals',
  (_) => {
    const unjournaledTasks = shallowRef<Task[]>([])

    const requestFetch = useRequestFetch()

    const fetchUnjournaledTasks = async () => {
      const tasks = await requestFetch<Task[]>('/api/tasks?queryType=unjournaled')
      unjournaledTasks.value = tasks
    }

    return {
      unjournaledTasks,
      fetchUnjournaledTasks
    }
  }
)
