import { fields as tasks } from './tasks'
import { journalSchema } from '~~/shared/utils/validation/journal'

const fields = [
  'id',
  'created_by',
  'created_at',
  'archived_at',
  'title',
  'text_body',
  'json_body'
]

export const journalsResource = new PostgRESTResource({
  endpoint: 'journals',
  fields,
  allowAnonymous: false,
  embeddedResources: { tasks },
  additionalParams: {
    GET: {
      default: [
        ['order', 'created_at.desc']
      ]
    }
  },
  schema: journalSchema.array()
})

export default defineEventHandler(journalsResource.handle)
