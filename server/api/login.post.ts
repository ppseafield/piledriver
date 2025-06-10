import { safeParse } from 'valibot'
import { sql } from 'kysely'
import { db } from '../database'

export default defineEventHandler(async (event) => {
  const { success, output, issues } = await readValidatedBody(event, body => safeParse(LoginRequestSchema, body))
  if (!success) {
    // TODO: write a util that wraps readValidatedBody / createError.
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid Request',
      message: { issues }
    })
  } else {
    // Check that the user + password combo exists.
    const passwordCheck = await db
      .selectFrom('pd_users')
      .selectAll('pd_users')
      .innerJoin('pd_passwords', 'pd_passwords.user_id', 'pd_users.id')
      .where('username', '=', sql<string>`${output.username}`)
      .where('password_hash', '=', db.fn('crypt', [sql<string>`${output.password}`, 'password_hash']))
      .execute()

    if (passwordCheck.length !== 1) {
      throw createError({
	statusCode: 404,
	statusMessage: 'User account not found.',
	message: 'login.error.accountNotFound'
      })
    } else {
      const [user] = passwordCheck

      // Create a session for the user.
      const session = await db
	.insertInto('pd_session')
	.values({
	  user_id: user.id
	})
        .returning(['id', 'user_id', 'created_at', 'expires_at', 'logged_out_at'])
	.executeTakeFirst()

      // Initialize the nuxt-auth user session
      await setUserSession(event, {
	user,
	secure: session
      })

      // Return the user & session
      return {
	user,
	session
      }
    }
  }
})
