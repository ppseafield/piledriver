<script setup lang="ts">
defineI18nRoute({
  paths: {
    en: '/routines',
    de: '/routinen'
  }
})

definePageMeta({
  middleware: 'auth'
})

const { t } = useI18n()
const localePath = useLocalePath()
const rs = useRoutineStore()
await rs.fetch()

const breadcrumbs = [{
  label: t('routines.pageTitle'),
  to: localePath('/routines')
}]

const entries = computed(() => {
  return rs.routines.map(r => ({
    title: r.title,
    description: r.description,
    path: localePath(`/routines/${r.id}`)
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
	    :label="t('routineNew.pageTitle')"
	    icon="i-carbon-add-filled"
	    :to="localePath('/routines/new')"
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

