import { defineConfig } from 'kysely-ctl'
import { dialect } from './server/database'

export default defineConfig({
  dialect
})
