import type { AuthStatus, LoginRequest, User } from '~~/shared/types'

export const useSessionStore = defineStore('session', () => {
  const user = ref<User | null>(null)
  const authStatus = ref<AuthStatus>('unknown')

  function setUser(u: User | null) {
    user.value = u
    authStatus.value = u?.user_id ? 'user' : 'anonymous'
  }

  async function login(loginRequest: LoginRequest): Promise<boolean> {
    // TODO: check if User[] is the actual return type
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

  async function restore(): Promise<void> {
    if (authStatus.value === 'unknown') {
      const restoreResponse = await $fetch<User[]>('/api/restore-session')
      if (restoreResponse.length > 0) {
        setUser(restoreResponse[0] as User)
      } else {
        setUser(null)
      }
    }
  }

  return { user, authStatus, setUser, login, restore }
})
