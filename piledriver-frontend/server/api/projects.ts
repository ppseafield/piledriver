import { fields as tasks } from './tasks'
import { projectSchema } from '~~/shared/utils/validation/project'

const fields = [
  'id',
  'created_by',
  'created_at',
  'archived_at',
  'title',
  'description',
  'color',
  'icon_name'
]

const projectResource = new PostgRESTResource({
  endpoint: 'projects',
  fields,
  allowAnonymous: false,
  embeddedResources: { tasks },
  schema: projectSchema.array()
})

export default defineEventHandler(projectResource.handle)
