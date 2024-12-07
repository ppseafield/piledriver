// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-12-06",
  future: {
    compatibilityVersion: 4
  },

  typescript: {
    typeCheck: true
  },
  devtools: { enabled: true },

  extends: ["@nuxt/ui-pro"],
  modules: ["@nuxt/ui", "@pinia/nuxt", "@nuxt/test-utils/module"]
})
