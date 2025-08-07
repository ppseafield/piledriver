<script setup lang="ts">
import StarterKit from '@tiptap/starter-kit'
import { renderToHTMLString } from '@tiptap/static-renderer/pm/html-string'

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
	  <p>{{ shortDate(js.current.created_at) }}</p>
	  <div
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
