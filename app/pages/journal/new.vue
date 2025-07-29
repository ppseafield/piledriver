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
        <UPageHeader>
          <template #title>
            <UInput
	      v-model="title"
	      :ui="{}"
            />
          </template>
        </UPageHeader>
        <UPageBody>
          <EditorContent :editor="editor" />
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
