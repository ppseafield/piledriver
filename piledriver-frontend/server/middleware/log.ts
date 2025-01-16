export default defineEventHandler((event) => {
  console.log(new Date(), ' - ', getRequestURL(event))
})
