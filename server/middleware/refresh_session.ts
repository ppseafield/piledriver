import { safeParse } from 'valibot'
import { sql } from 'kysely'
import { db } from '../database'

// Make sure the user's session is refreshed every once in a while. (10min)
export default defineEventHandler(async (event) => {
  // TODO: if the max age for the session is expired, prompt for logging in again
  // would be nice if this was inline, i.e. one doesn't need to refresh the page
  // (and potentially lose work) to renew a login.
})
