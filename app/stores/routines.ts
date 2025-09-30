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

  return {
    routines,
    current,
    relatedSubtasks,

    fetch,
    fetchSingle
  }
})
