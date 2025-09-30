<script setup lang="ts">
import RoutineSubtaskList from '@/components/routines/RoutineSubtaskList.vue'

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

useHead({
  title: rs.current.title
})

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
	<RoutineSubtaskList
	  :routine="rs.current"
	  :subtaskList="rs.relatedSubtasks"
	/>
      </UPage>
    </template>
  </UDashboardPanel>
</template>
