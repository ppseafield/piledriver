export default defineNuxtRouteMiddleware(async (to) => {
  const { loggedIn } = useUserSession()
  if (!loggedIn.value) {
    navigateTo(`/login?redirect=${to.fullPath}`)
  }
})
