export default defineNuxtRouteMiddleware((to, from) => {
  const session = useUserSession()
  const localePath = useLocalePath()
  console.log('auth middleware - session:', session)
  if (!session.user.value) {
    return navigateTo(localePath('/login'))
  }
})
