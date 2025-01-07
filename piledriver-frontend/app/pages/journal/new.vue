<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'

definePageMeta({
  layout: 'dashboard-layout'
})

// const j = useJournalStore()
const title = ref<string>('')
const editorContent = ref<string>('')

const editor = useEditor({
  content: editorContent.value,
  extensions: [StarterKit],
  editorProps: {
    attributes: {
      class: 'prose w-full min-h-96 border border-crocodile-300 rounded-lg p-1'
    }
  }
})
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar title="Journal" />

      <UDashboardToolbar>
        <template #right>
          <UButton
            color="primary"
            label="Save New Journal Entry"
            icon="i-heroicons-check"
          />
        </template>
      </UDashboardToolbar>

      <UDashboardPanelContent>
        <div>
          <UInput
            v-model="title"
            label="Title"
            placeholder="Enter a title for your journal entry"
          />
        </div>
        <div>
          <EditorContent :editor="editor" />
        </div>
      </UDashboardPanelContent>
    </UDashboardPanel>
  </UDashboardPage>
</template>
