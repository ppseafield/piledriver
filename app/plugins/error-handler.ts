export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.hook('vue:error', (err) => {
    // const route = useRoute()
    const localePath = useLocalePath()
    if (String(err).endsWith('401 errors.network.notAuthorized')) {
      navigateTo({
	path: localePath('/login')
	// , query: { returnTo: route.path }
	// // Doesn't work - error happens before route officially changes,
	// // so it just returns you to the route *before* the error happened.
	// // Will need to figure out how to capture the error in $fetch or in
	// // the store itself
      })
    } else {
      console.log('vue error is:', err)
    }
  })
})
