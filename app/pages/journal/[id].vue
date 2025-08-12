<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import { renderToHTMLString } from '@tiptap/static-renderer/pm/html-string'
import type { CheckboxGroupItem, CheckboxGroupValue } from "@nuxt/ui"
import type { Task } from "#shared/types/database/tasks"

defineI18nRoute({
  paths: {
    en: '/journal/[id]',
    de: '/tagebuch/[id]'
  }
})
const { t, d } = useI18n()
const localePath = useLocalePath()
const js = useJournalStore()
const route = useRoute()

await js.fetchSingle(route.params.id)

useHead({
  title: js.current.title
})

const breadcrumbs = computed(() => [
  { label: t('journal.pageTitle'),
    to: localePath('/journal')
  },
  { label: js.current?.title ?? '',
    to: localePath('/journal/new')
  }
])

const postDate = computed(() => {
  console.log('js current:', js.current)
  if (js.current) {
    return dateFromTimestamptz(js.current.created_at)
  } else {
    return null
  }
})

const postHTML = computed(() => {
  return renderToHTMLString({
    content: js.current?.json_body ?? ({ 'type': 'doc', 'content': [] } as any),
    extensions: [StarterKit]
  })
})

const editing = ref<boolean>(false)

const editor = useEditor({
  content: js.current.json_body,
  editorProps: {
    attributes: {
      'class': 'min-h-[50vh] mt-2 p-2 pb-4 ring ring-inset ring-inset-2 rounded-md',
      id: 'journal-body-editor'
    }
  },
  extensions: [StarterKit]
})

const toggleEdit = () => {
  if (editing.value) {
    editing.value = false
    // Reset body text
    editor.value.commands.setContent(js.current.json_body)
  } else {
    editing.value = true
  }
}

const updateJournal = async () => {
  await js.update({
    id: js.current.id,
    // TODO: update title
    text_body: editor.value.getText(),
    json_body: editor.value.getJSON()
  })
}
// TODO: edit the tasks associated with the journal.
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar>
	<template #leading>
	  <UDashboardSidebarCollapse />
	</template>

	<template #title>
	  <UBreadcrumb :items="breadcrumbs" />
	</template>
	
	<template #right>
	  <template v-if="editing">
	    <UButton
	      :label="t('actions.save')"
	      icon="i-carbon-save"
	      @click="updateJournal"
	    />
	    <UButton
	      :label="t('actions.saveDraft')"
	      icon="i-carbon-rule-draft"
	    />
	    <UButton
	      :label="t('actions.cancel')"
	      icon="i-carbon-close"
	      @click="toggleEdit"
	    />
	  </template>
	  <template v-else>
	    <UButton
	      :label="t('actions.edit')"
	      icon="i-carbon-edit"
	      @click="toggleEdit"
	    />
	  </template>
	</template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <UPage
        :ui="{ center: 'lg:col-span-7' }"
      >
        <UPageBody>
	  <p>{{ shortDate(js.current.created_at) }}</p>
	  <EditorContent
	    v-if="editing"
	    :editor="editor"
	  />
	  <div
	    v-else
	    class="journal-editor flex flex-col"
	    v-html="postHTML"
	  />
        </UPageBody>

        <template #right>
          <UPageAside>
	    <p>Completed Tasks</p>
	    <ol
	      v-if="js.relatedTasks.length > 0"
	      class="list-decimal mt-2"
	    >
	      <li
		v-for="task in js.relatedTasks"
		:key="task.id"
	      >
		{{ task.title }}
	      </li>
	    </ol>
          </UPageAside>
        </template>
      </UPage>
    </template>
  </UDashboardPanel>

</template>
