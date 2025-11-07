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
  const mapping = ref<Record<string, Project>>({})
  const current = ref<Project | null>(null)
  const relatedTasks = ref<Tasks[]>([])

  /** Fetches the dashboard's tasks. */
  const fetch = async () => {
    const requestFetch = useRequestFetch()
    const response = await requestFetch<Project[]>('/api/projects')
    projects.value = response

    const newMapping = {}
    for (const p of response) {
      newMapping[p.id] = p
    }
    mapping.value = newMapping
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
  // TODO: reorder task -- requires sql function (changing task order)
  const reorderTask = async (taskId: string, newIndex: number) => {
    console.log('todo: reorderTask')
  }

  return {
    projects,
    mapping,
    current,
    relatedTasks,

    fetch,
    fetchSingle,
    reorderTask
  }
})
