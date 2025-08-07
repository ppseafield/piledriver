import en from './i18n/locales/en.json'
import de from './i18n/locales/de.json'

export default defineI18nConfig(() => {
  return {
    legacy: false,
    locale: 'en',
    messages: {
      en,
      de
    },
    datetimeFormats: {
      en: {
	short: {
	  year: 'numeric', month: 'short', day: 'numeric'
	},
	long: {
	  year: 'numeric', month: 'short', day: 'numeric',
	  weekday: 'short', hour: 'numeric', minute: 'numeric'
	}
      },
      de: {
	short: {
	  year: 'numeric', month: 'short', day: 'numeric'
	},
	long: {
	  year: 'numeric', month: 'short', day: 'numeric',
	  weekday: 'short', hour: 'numeric', minute: 'numeric'
	}
      }
    }
  }
})
