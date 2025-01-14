<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import EditorToolbar from '~/components/journal/EditorToolbar.vue'

definePageMeta({
  layout: 'dashboard-layout'
})

const j = useJournalStore()
const route = useRoute()
await j.ensureCurrent(route.params.journalId)

const editing = ref<boolean>(false)
const editor = useEditor({
  content: j.currentItem?.json_body ?? '',
  editable: editing.value,
  extensions: [
    StarterKit,
    Placeholder.configure({
      placeholder: 'Start writing...'
    })
  ],
  editorProps: {
    attributes: {
      class: 'prose w-full h-full border border-crocodile-100 rounded-lg p-4 outline outline-0'
    }
  }
})
const toggleEdit = () => {
  const newEditing = !editing.value
  editing.value = newEditing
  editor.value?.setEditable(newEditing)
}
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar
        :ui="{ left: 'grow min-w-full' }"
        :title="'title'"
      />

      <UDashboardToolbar>
        <template #left>
          <EditorToolbar
            v-if="editing"
            :editor="editor"
          />
          <span v-else>Published ...</span>
        </template>

        <template #right>
          <UButton
            color="primary"
            label="Edit"
            icon="i-heroicons-check"
            @click="toggleEdit"
          />
        </template>
      </UDashboardToolbar>

      <UDashboardPanelContent>
        <div class="flex gap-4 h-full">
          <section class="w-2/3 h-full tiptap-container">
            <EditorContent :editor="editor" />
          </section>
          <UAside
            :ui="{ wrapper: 'w-1/3' }"
          >
            <template #top>
              <h3>Completed Tasks</h3>
            </template>

            <ul>
              <li
                v-for="task in j.currentItem?.tasks"
                :key="task.id"
              >
                <UCheckbox
                  :model-value="true"
                  :label="task.title"
                  :disabled="true"
                />
              </li>
            </ul>
          </UAside>
        </div>
      </UDashboardPanelContent>
    </UDashboardPanel>
  </UDashboardPage>
</template>
