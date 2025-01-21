// https://nuxt.com/docs/api/configuration/nuxt-config
// TODO: consider:
// nuxt-seo and @nuxtjs/robots
// nuxt-mailpit
// pinia-plugin-persistedstate and `destr`

// Workaround: adding 'ui' trips up this rule. security: {...} doesn't.
// eslint-disable-next-line nuxt/nuxt-config-keys-order
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
    '@nuxt/fonts',
    'nuxt-auth-utils'
  ],
  devtools: { enabled: true },

  app: {
    head: {
      title: 'Piledriver',
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      htmlAttrs: {
        lang: 'en'
      }
    }
  },
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
  },
  ui: {
    safelistColors: ['dodger-blue', 'malibu', 'tango', 'energy-yellow']
  }
})
