<script setup lang="ts">
import StarterKit from '@tiptap/starter-kit'
import { renderToHTMLString } from '@tiptap/static-renderer/pm/html-string'

defineI18nRoute({
  paths: {
    en: '/journal/[id]',
    de: '/tagebuch/[id]'
  }
})
const { t } = useI18n()
const localePath = useLocalePath()
const js = useJournalStore()
const route = useRoute()

await js.fetchSingle(route.params.id)

const breadcrumbs = computed(() => [
  { label: t('journal.pageTitle'),
    to: localePath('/journal')
  },
  { label: js.current?.title ?? '',
    to: localePath('/journal/new')
  }
])

console.log('renderToHTMLString',renderToHTMLString)
console.log('extensions', [StarterKit])

const postHTML = computed(() => {
  console.log('js.current json body', js.current.json_body)
  return renderToHTMLString({
    content: js.current?.json_body ?? ({ 'type': 'doc', 'content': [] } as any),
    extensions: [StarterKit]
  })
})

watch(() => postHTML, (value) => {
  console.log('updated postHTML:', postHTML)
})
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
	  />
	</template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <UPage
        :ui="{ center: 'lg:col-span-7' }"
      >
        <UPageBody>
	  <div
	    class="flex flex-col"
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
