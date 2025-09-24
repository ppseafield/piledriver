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

definePageMeta({
  middleware: 'auth'
})

const { t, d } = useI18n()
const localePath = useLocalePath()
const route = useRoute()
const js = useJournalStore()

await js.fetchSingle(route.params.id)

useHead({
  title: js.current.title
})

const breadcrumbs = computed(() => [
  { label: t('journal.pageTitle'),
    to: localePath('/journal')
  },
  { label: js.current?.title ?? '',
    to: localePath(`/journal/${route.params.id}`)
  }
])

const postDate = computed(() => {
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
const title = ref<string>(js.current.title)

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
    title: title.value,
    text_body: editor.value.getText(),
    json_body: editor.value.getJSON()
  })
  editing.value = false
}
// TODO: edit the tasks associated with the journal.
// TODO: draft functionality?
// TODO: dropdown menu for buttons
// TODO: component that takes list of actions and makes both desktop buttons and mobile dropdown
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
	    <!-- <UButton
	      :label="t('actions.saveDraft')"
	      icon="i-carbon-rule-draft"
	      /> -->
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
	  <p
	    v-if="!editing && js.current.updated_at > js.current.created_at"
	  >
	    {{ shortDate(js.current.updated_at) }}
	  </p>
	  <div
	    v-if="editing"
	    class="flex flex-col"
	  >
	    <label for="title" class="text-sm font-bold mb-2">
	      {{ t('journalNew.titleLabel') }}
	    </label>
            <UInput
	      v-model="title"
	      name="title"
	      id="title"
	      :ui="{ base: 'w-100 grow' }"
            />
	  </div>

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
