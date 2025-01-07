import type { Task } from '~~/shared/types/tasks'
import type { Journal } from '~~/shared/types/journal'

interface TaskStore {
  tasksToJournal: Ref<Task[]>
}

export const useJournalStore = defineStoreForResource<Journal, TaskStore>(
  'journals',
  (_) => {
    const tasksToJournal = ref<Task[]>([])

    return {
      tasksToJournal
    }
  }
)
