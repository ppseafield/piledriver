export default defineEventHandler((event) => {
  // TODO: actual logging via some kind of service?
  console.log('New request: ' + getRequestURL(event))
})
