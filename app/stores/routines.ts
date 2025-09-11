import { defineStore } from 'pinia'
import { v7 as uuid } from 'uuid'

export const useRoutineStore = defineStore('routines', () => {
  const routines = ref<Routine[]>([])
  const current = ref<Routine | null>(null)

  const fetch = async () => {
    const requestFetch = useRequestFetch()
    const response = await requestFetch<Routine[]>('/api/routines')
    routines.value = response
  }

  return {
    routines,
    current,

    fetch
  }
})
