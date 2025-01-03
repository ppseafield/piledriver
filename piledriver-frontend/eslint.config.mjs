// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  // Your custom configs here
).override('nuxt/stylistic', {
  rules: {
    '@stylistic/brace-style': [
      'error',
      '1tbs',
      {
        allowSingleLine: true
      }
    ],
    '@stylistic/comma-dangle': ['error', 'never'],
    '@vue/comma-dangle': ['error', 'never'],
    'vue/no-multiple-template-root': ['off']
  }
})
