// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  future: {
    compatibilityVersion: 4
  },
  devtools: { enabled: true },

  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxt/test-utils',
    '@nuxt/ui-pro',
    '@nuxtjs/i18n',
    '@nuxt/test-utils/module',
    '@vueuse/nuxt',
    // 'nuxt-security',
    'nuxt-auth-utils',
    '@nuxtjs/html-validator',
    '@nuxtjs/seo',
    '@nuxtjs/storybook',
    '@pinia/nuxt'
  ],

  css: ['~/assets/css/main.css'],

  fonts: {
    priority: ['local']
  },

  i18n: {
    locales: [
      { code: 'en', name: 'English', file: 'en.json' },
      { code: 'de', name: 'Deutsch', file: 'de.json' },
    ],
    defaultLocale: 'en',
  },

  icon: {
    customCollections: [
      { prefix: 'custom',
	dir: './assets/icons'
      }
    ]
  },

  runtimeConfig: {
    session: {
      maxAge: 60 * 60 * 24 * 14
    }
  },

  storybook: {
    enabled: false
  }
})
