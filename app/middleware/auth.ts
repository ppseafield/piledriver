export default defineNuxtRouteMiddleware((to, from) => {
  const session = useUserSession()
  const localePath = useLocalePath()

  if (!session.user.value) {
    return navigateTo(localePath('/login'))
  }
})
