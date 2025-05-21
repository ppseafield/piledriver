import type { Meta, StoryObj } from '@storybook/vue3'
import AppHeader from '~/components/layouts/AppHeader.vue'

const meta = {
  title: 'Layouts/AppHeader',
  component: AppHeader,
  tags: ['autodocs'],
} satisfies Meta<typeof AppHeader>

export default meta

type Story = StoryObj<typeof meta>
export const AppHeaderStory: Story = {
    args: {}
}
