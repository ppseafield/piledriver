// @vitest-environment nuxt
import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import ExampleComponent from './ExampleComponent.vue'

describe('ExampleComponent', () => {
  it('renders correctly', async () => {
    const wrapper = await mountSuspended(ExampleComponent)
    expect(wrapper.text()).toContain('Example Component')
  })
})
