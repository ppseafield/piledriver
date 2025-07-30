<script setup lang="ts">
defineI18nRoute({
  paths: {
    en: '/journal',
    de: '/tagebuch'
  }
})
const { t } = useI18n()
const localePath= useLocalePath()
const js = useJournalStore()

const breadcrumbs = [{
  label: t('journal.pageTitle'),
  to: localePath('/journal')
}]

await js.fetch()

const entries = computed(() => {
  return js.journals.map(j => ({
    title: j.title,
    date: j.created_at,
    path: localePath(`/journal/${j.id}`)
  }))
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
	    :label="t('dashboard.journalTasksButton')"
	    icon="i-carbon-notebook-reference"
	    :to="localePath('/journal/new')"
	  />
	</template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <UPage :ui="{ center: 'lg:col-span-7' }">
        <UPageBody>
	  <UBlogPosts orientation="vertical">
	    <UBlogPost
	      v-for="entry in entries"
	      :key="entry.path"
	      v-bind="entry"
	      :to="entry.path"
	    />
	  </UBlogPosts>
        </UPageBody>
      </UPage>
    </template>
  </UDashboardPanel>
</template>
