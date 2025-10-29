// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-09-03',

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
    '@pinia/nuxt',
    '@nuxtjs/storybook'
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
    // Storybook tries to run during npm run dev, but complains about
    // Error [ERR_PACKAGE_PATH_NOT_EXPORTED]: Package subpath './preset'
    // is not defined by "exports" in {..}/@storybook-vue/nuxt/pakcage.json,
    // so just run it separately
    enabled: false
  }
})
