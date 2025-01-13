<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import EditorToolbar from '~/components/journal/EditorToolbar.vue'

definePageMeta({
  layout: 'dashboard-layout'
})

const j = useJournalStore()

await j.fetchUnjournaledTasks()

const tasks = reactive<Task[]>([])
const checked = reactive<Record<UUID, boolean>>({})

onMounted(() => {
  tasks.push(...j.unjournaledTasks)
  for (const task of tasks) {
    checked[task.id as UUID] = true
  }
})

const title = ref<string>('')
const editorContent = ref<string>('')

const editor = useEditor({
  content: editorContent.value,
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
onBeforeUnmount(() => {
  editor.value?.destroy()
})

const saveNewJournal = async () => {
  const newJournal = await j.createJournal(
    {
      title: title.value,
      text_body: editor.value?.getHTML() ?? '',
      json_body: editor.value?.getJSON() ?? {}
    },
    tasks.filter(task => checked[task.id as UUID])
  )
  console.log('new journal created:', newJournal)
}
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar
        :ui="{ left: 'grow min-w-full' }"
      >
        <template #left>
          <UInput
            v-model="title"
            label="Title"
            placeholder="Title..."
            :ui="{ wrapper: 'grow', form: 'grow' }"
          />
        </template>
      </UDashboardNavbar>

      <UDashboardToolbar>
        <template #left>
          <EditorToolbar :editor="editor" />
        </template>

        <template #right>
          <UButton
            color="primary"
            label="Save"
            icon="i-heroicons-check"
            @click="saveNewJournal"
          />
        </template>
      </UDashboardToolbar>

      <UDashboardPanelContent>
        <div class="flex gap-4 h-full">
          <section class="w-2/3 h-full tiptap-container">
            <EditorContent
              :editor="editor"
              class="h-full"
            />
          </section>
          <UAside
            :ui="{ wrapper: 'w-1/3' }"
          >
            <template #top>
              <h3>Completed Tasks</h3>
            </template>

            <ul>
              <li
                v-for="task in tasks"
                :key="task.id"
              >
                <UCheckbox
                  v-model="checked[task.id as UUID]"
                  :label="task.title"
                />
              </li>
            </ul>
          </UAside>
        </div>
      </UDashboardPanelContent>
    </UDashboardPanel>
  </UDashboardPage>
</template>

<style>
.tiptap-container .tiptap p.is-editor-empty:first-child::before {
  color: #adb5bd;
  content: attr(data-placeholder);
  float: left;
  height: 0;
  pointer-events: none;
}
</style>
