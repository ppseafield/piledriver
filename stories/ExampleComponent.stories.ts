import type { Meta, StoryObj } from '@storybook/vue3'
import ExampleComponent from '~/components/ExampleComponent.vue'

const meta = {
  title: 'Example/ExampleComponent',
  component: ExampleComponent,
  tags: ['autodocs'],
} satisfies Meta<typeof ExampleComponent>

export default meta
type Story = StoryObj<typeof meta>
export const ExampleComponentStory: Story = {
  args: {}
}

