import type { LoginRequest, User } from '~~/shared/types'

export const useSessionStore = defineStore('session', () => {
  async function login(loginRequest: LoginRequest): Promise<boolean> {
    const loginResponse = await $fetch<User>('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: loginRequest
    })
    if (loginResponse?.user_id) {
      return true
    } else {
      return false
    }
  }

  async function logout(): Promise<void> {
    await $fetch('/api/logout')
  }

  return { login, logout }
})
