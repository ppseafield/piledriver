<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import type { CheckboxGroupItem, CheckboxGroupValue } from "@nuxt/ui"
import type { Task } from "#shared/types/database/tasks"

defineI18nRoute({
  paths: {
    en: '/journal/new',
    de: '/tagebuch/neu'
  }
})
const { t } = useI18n()
const localePath = useLocalePath()
const ts = useTasksStore()
// TODO: consider caching this so it isn't fetched every time
await ts.fetch()

const breadcrumbs = [
  { label: t('journal.pageTitle'),
    to: localePath('/journal')
  },
  { label: t('journalNew.pageTitle'),
    to: localePath('/journal/new')
  }
]

const title = ref<string>('')

const editor = useEditor({
  content: '',
  editorProps: {
    attributes: {
      'class': 'min-h-[50vh] mt-2 p-2 pb-4 ring ring-inset ring-inset-2',
      id: 'journal-body-editor'
    }
  },
  extensions: [StarterKit]
})

const saveJournal = () => {
  console.log('TODO save journal')
}

// Specify the selected completed tasks for the sidebar.
const completedTasks : CheckboxGroupItem[] = ts.completed.map(t => ({
  label: t.title,
  value: t.id
}))
const selectedTasks = ref<CheckboxGroupValue[]>(
  ts.completed.map((task: Task) => task.id)
)
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
	  <UButton
	    :label="t('actions.save')"
	    icon="i-carbon-save"
	    @click="saveJournal"
	  />
	</template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <UPage
        :ui="{ center: 'lg:col-span-7' }"
      >
        <UPageBody>
	  <div class="flex flex-col">
	    <label for="title" class="text-sm font-bold mb-2">
	      {{ t('journalNew.titleLabel') }}
	    </label>
            <UInput
	      v-model="title"
	      name="title"
	      id="title"
	      :ui="{ base: 'w-100' }"
            />
	  </div>

	  <div>
	    <label for="journal-body-editor" class="text-sm font-bold mb-2 pb-2">
	      {{ t('journalNew.entryLabel') }}
	    </label>

            <EditorContent
	      class="where-do-we-go-now"
	      :editor="editor"
	    />
	  </div>
        </UPageBody>

        <template #right>
          <UPageAside>
            <UCheckboxGroup
	      v-if="completedTasks.length > 0"
              v-model="selectedTasks"
              :items="completedTasks"
              :legend="t('journalNew.completedTasksLegend')"
            />
	    <div v-else>
	      <p>{{ t('journalNew.noUnjournaledTasks') }}</p>
	    </div>
          </UPageAside>
        </template>
      </UPage>
    </template>
  </UDashboardPanel>
</template>
