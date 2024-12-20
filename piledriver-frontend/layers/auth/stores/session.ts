import type { AuthStatus, LoginRequest } from '~~/shared/types'

export const useSessionStore = defineStore('session', () => {
  const user = ref<User | null>(null)
  const authStatus = ref<AuthStatus>('unknown')

  function setUser(u: User | null) {
    user.value = u
    authStatus.value = u?.user_id ? 'user' : 'anonymous'
  }

  async function login(loginRequest: LoginRequest): Promise<boolean> {
    const loginResponse = await $fetch<User>('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: loginRequest
    })
    if (loginResponse?.user_id) {
      setUser(loginResponse)
      return true
    } else {
      setUser(null)
      return false
    }
  }

  return { user, authStatus, setUser, login }
})
