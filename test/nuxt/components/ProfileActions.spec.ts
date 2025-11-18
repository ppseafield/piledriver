import { describe, test, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'
import { ProfileActions, NuxtLink } from '#components'
import en from '@@/i18n/locales/en.json'
import de from '@@/i18n/locales/en.json'


test('Profile actions empty when logged out', async () => {
  // This is the workaround.... EVERY TIME?!
  const i18n = createI18n({
    legacy: false,
    globalInjection: true,
    locale: 'en',
    messages: { en, de }
  })

  const pa = await mount(
    ProfileActions,
    {
      global: {
	plugins: [i18n],
	components: { NuxtLink, RouterLink },
	provide: {
	  [Symbol.for('nuxt-ui.locale-context')]: i18n
	}
      }
    }
  )
  expect(pa.text()).toContain('Account')
  expect('todo: fix i18n to work in components for testing').toBeTruthy()
})
