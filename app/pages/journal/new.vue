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
const js = useJournalStore()
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
const otherCompletedText = ref<string>('')
const newRemainingText = ref<string>('')

const editor = useEditor({
  content: '',
  editorProps: {
    attributes: {
      'class': 'min-h-[50vh] mt-2 p-2 pb-4 ring ring-inset ring-inset-2 rounded-md',
      id: 'journal-body-editor'
    }
  },
  extensions: [StarterKit]
})

// Specify the selected completed tasks for the sidebar.
const completedTasks : CheckboxGroupItem[] = ts.completed.map(t => ({
  label: t.title,
  value: t.id
}))
const selectedTasks = ref<CheckboxGroupValue[]>(
  ts.completed.map((task: Task) => task.id)
)

const saveJournal = async () => {
  // TODO validate contents
  const newJournal = await js.create({
    journal: {
      title: title.value,
      text_body: editor.value.getText(),
      json_body: editor.value.getJSON()
    },
    task_ids: selectedTasks.value,
    other_completed: otherCompletedText.value.split("\n").map(oct => oct.trim()).filter(oct => oct.length > 0),
    new_remaining: newRemainingText.value.split("\n").map(nrt => nrt.trim()).filter(nrt => nrt.length > 0)
  })
  navigateTo(localePath({ name: 'journal-id', params: { id: newJournal.id } }))
}
// TODO: Possibly? Swap <UTextarea /> with <EditorContent /> (add numbers, style text more)
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
        :ui="{ center: 'lg:col-span-6', right: 'lg:col-span-4' }"
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
	      :ui="{ base: 'w-100 grow' }"
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
          <UPageAside :ui="{ root: 'lg:col-span-4', container: 'flex flex-col gap-y-18 w-100 lg' }">
	    <div class="w-100">
              <UCheckboxGroup
		v-if="completedTasks.length > 0"
		v-model="selectedTasks"
		:items="completedTasks"
		:legend="t('journalNew.completedTasksLegend')"
		:ui="{ legend: 'font-bold' }"
              />
	      <p v-else>{{ t('journalNew.noUnjournaledTasks') }}</p>
	    </div>

	    <div class="w-100">
	      <fieldset class="flex flex-col gap-x-2 gap-y-1 w-100">
		<legend class="mb-1 block font-medium text-sm">
		  <span class="font-bold me-2">{{ t('journalNew.otherCompletedTasks') }}</span>
		  <UPopover
		    mode="hover"
		    color="secondary"
		    :open-delay="500"
		    :close-delay="300"
		    :content="{ side: 'top' }"
		    :ui="{ content: 'p-2 max-w-sm' }"
		  >
		    <UButton
		      icon="i-carbon-information"
		      size="sm"
		    />
		    <template #content>
		      <p>{{ t('journalNew.info.otherCompletedTasks') }}</p>
		    </template>
		  </UPopover>
		</legend>

		<UTextarea
		  v-model="otherCompletedText"
		  :rows="4"
		  autoresize
		  :ui="{ base: '' }"
		/>
	      </fieldset>
	    </div>

	    <div>
	      <fieldset class="flex flex-col gap-x-2 gap-y-1">
		<legend class="mb-1 block font-medium text-sm">
		  <span class="font-bold me-2">{{ t('journalNew.newRemainingTasks') }}</span>
		  <UPopover
		    mode="hover"
		    color="secondary"
		    :open-delay="500"
		    :close-delay="300"
		    :content="{ side: 'top' }"
		    :ui="{ content: 'p-2 max-w-sm' }"
		  >
		    <UButton
		      icon="i-carbon-information"
		      size="sm"
		    />
		    <template #content>
		      <p>{{ t('journalNew.info.newRemainingTasks') }}</p>
		    </template>
		  </UPopover>
		</legend>

		<UTextarea
		  v-model="newRemainingText"
		  :rows="4"
		  autoresize
		/>
	      </fieldset>
	    </div>
          </UPageAside>
        </template>
      </UPage>
    </template>
  </UDashboardPanel>
</template>
