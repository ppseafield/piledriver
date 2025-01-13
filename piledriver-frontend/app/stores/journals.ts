import type { ShallowRef } from 'vue'
import type { Task } from '~~/shared/types/tasks'
import type { Journal } from '~~/shared/types/journal'
import { useSessionStore } from '~~/layers/auth/stores/session'
import { journalSchema } from '~~/shared/utils/validation/journal'

interface JournalStore {
  unjournaledTasks: ShallowRef<Task[]>
  fetchUnjournaledTasks: () => Promise<void>
  createJournal: (journal: Journal, tasks: Task[]) => Promise<Journal>
}

export const useJournalStore = defineStoreForResource<Journal, JournalStore>(
  'journals',
  (rsc) => {
    const s = useSessionStore()
    const t = useTaskStore()
    const unjournaledTasks = shallowRef<Task[]>([])

    const requestFetch = useRequestFetch()

    const fetchUnjournaledTasks = async () => {
      const tasks = await requestFetch<Task[]>('/api/tasks?queryType=unjournaled')
      unjournaledTasks.value = tasks
    }

    const createJournal = async (journal: Partial<Journal>, tasks: Task[]) => {
      // TODO: try/catch, set global error toast.
      // journalSchema.parse(
      const j = {
        created_by: s.user?.user_id as UUID,
        created_at: nowTemporal(),
        archived_at: null,
        ...journal
      }
      console.log('creating journal', j)
      const journalToCreate = journalSchema.parse(j)
      const [newJournal] = await requestFetch<Journal[]>('/api/journals', {
        method: 'POST',
        body: [journalToCreate]
      })
      if (newJournal && tasks.length > 0) {
        await t.put(
          tasks.map(t => ({ ...t, journaled_by: newJournal.id }))
        )
        rsc.items.value.push(newJournal)
        triggerRef(rsc.items)
      }
      return newJournal
    }

    return {
      unjournaledTasks,
      fetchUnjournaledTasks,
      createJournal
    }
  }
)
