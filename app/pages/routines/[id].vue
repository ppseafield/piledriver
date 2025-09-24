<script setup lang="ts">
defineI18nRoute({
  paths: {
    en: '/routines/[id]',
    de: '/routinen/[id]'
  }
})

definePageMeta({
  middleware: 'auth'
})

const { t } = useI18n()
const localePath = useLocalePath()
const route = useRoute()
const rs = useRoutineStore()

await rs.fetchSingle(route.params.id)

const breadcrumbs = [
  { label: t('routines.pageTitle'),
    to: localePath('/routines')
  },
  { label: rs.current?.title ?? '',
    to: localePath(`/routines/${route.params.id}`)
  }
]


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
      </UDashboardNavbar>
    </template>

    <template #body>
      <UPage>
	page
      </UPage>
    </template>
  </UDashboardPanel>
</template>
