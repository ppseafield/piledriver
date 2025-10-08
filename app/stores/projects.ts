import { defineStore } from 'pinia'
import { v7 as uuid } from 'uuid'
import type { Project } from '@@/shared/types/database/projects'
import type { Task } from '@@/shared/types/database/tasks'

// TODO: should be in shared/types
interface ProjectSingle {
  project: Project
  tasks: Task[]
}

export const useProjectStore = defineStore('projects', () => {
  const projects = ref<Project[]>([])
  const current = ref<Project | null>(null)
  const relatedTasks = ref<Tasks[]>([])

  /** Fetches the dashboard's tasks. */
  const fetch = async () => {
    const requestFetch = useRequestFetch()
    const response = await requestFetch<Project[]>('/api/projects')
    projects.value = response
  }

  /** Fetch a single project and its tasks */
  const fetchSingle = async (id: string) => {
    const requestFetch = useRequestFetch()
    const { project, tasks } = await requestFetch<ProjectSingle>(`/api/projects/${id}`)
    current.value = project
    relatedTasks.value = tasks
  }

  // TODO: create
  // TODO: update
  // TODO: archive
  // TODO: add task
  // TODO: assign task -- requires sql function (changing task order)
  // TODO: unassign task -- requires sql function (changing task order)

  return {
    projects,
    current,
    relatedTasks,

    fetch,
    fetchSingle
  }
})
