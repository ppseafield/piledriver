import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
  plugins: [],
  test: {
    environment: 'happy-dom'
  }
})
