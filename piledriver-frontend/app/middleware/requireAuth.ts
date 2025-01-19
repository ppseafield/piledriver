import { useSessionStore } from '~~/layers/auth/stores/session'

export default defineNuxtRouteMiddleware(async (to) => {
  const s = useSessionStore()
  await s.restore()
  console.log('CHECKING AUTH STATE:', s.user)
  if (s.authStatus !== 'user') {
    navigateTo(`/login?redirect=${to.fullPath}`)
  }
})
