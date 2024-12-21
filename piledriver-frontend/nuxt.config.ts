// https://nuxt.com/docs/api/configuration/nuxt-config
// TODO: consider:
// nuxt-seo and @nuxtjs/robots
// nuxt-mailpit
// pinia-plugin-persistedstate and `destr`

export default defineNuxtConfig({
  extends: ['@nuxt/ui-pro'],
  modules: [
    '@nuxt/ui',
    '@pinia/nuxt',
    '@nuxt/test-utils/module',
    'nuxt-security',
    '@nuxtjs/html-validator',
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/content',
    '@nuxt/fonts'
  ],
  devtools: { enabled: true },

  colorMode: {
    preference: 'light'
  },
  runtimeConfig: {
    postgrestUrl: '',
    jwtSecret: '',
    nodeEnv: process.env.NODE_ENV
  },
  future: {
    compatibilityVersion: 4
  },
  compatibilityDate: '2024-12-06',

  typescript: {
    typeCheck: true
  },
  eslint: {
    checker: true,
    config: {
      stylistic: true
    }
  },

  fonts: {
    provider: 'local',
    families: [
      { name: 'Montserrat', provider: 'local' },
      { name: 'MontserratAlternatives', provider: 'local' },
      { name: 'Atkinson-Hyperlegible', provider: 'local' }
    ]
  },
  security: {
    // todo
  }
})
