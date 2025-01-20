import { defineStoreForResource } from '~/utils/postgrest-resource-store'
import type { Project } from '~~/shared/types/projects'

interface ProjectStore {
  assignProject(project: Project): Promise<Project>
}

export const useProjectStore = defineStoreForResource<Project, ProjectStore>(
  'projects',
  (_) => {
    const assignProject = async (project: Project): Promise<Project> => {
      console.log('TODO: assignProject:', project)
      return project
    }
    return {
      assignProject
    }
  }
)
