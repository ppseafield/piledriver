<script setup lang="ts">
defineI18nRoute({
  paths: {
    en: '/projects',
    de: '/projekte'
  }
})

definePageMeta({
  middleware: 'auth'
})

const { t } = useI18n()
const localePath = useLocalePath()
const ps = useProjectStore()
await ps.fetch()

const breadcrumbs = [{
  label: t('projects.pageTitle'),
  to: localePath('/projects')
}]

const entries = computed(() => {
  return ps.projects.map(p => ({
    title: p.title,
    description: p.description,
    path: localePath(`/projects/${p.id}`)
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
	    :label="t('projectNew.pageTitle')"
	    icon="i-carbon-add-filled"
	    :to="localePath('/projects/new')"
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
