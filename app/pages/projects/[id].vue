<script setup lang="ts">
import ProjectTaskList from '@/components/tasks/ProjectTaskList.vue'

defineI18nRoute({
  paths: {
    en: '/projects/[id]',
    de: '/projects/[id]'
  }
})

definePageMeta({
  middleware: 'auth'
})

const { t } = useI18n()
const localePath = useLocalePath()
const route = useRoute()
const ps = useProjectStore()

await ps.fetchSingle(route.params.id)

useHead({
  title: ps.current.title
})

const breadcrumbs = [
  { label: t('projects.pageTitle'),
    to: localePath('/projects')
  },
  { label: ps.current?.title ?? '',
    to: localePath(`/projects/${route.params.id}`)
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

	<template #right>
	  <div class="hidden lg:block">
	    <UButton
	      :label="t('project.addTask')"
              icon="i-carbon-add-filled"
	      :disabled="true"
	      @click="ps.addEmptySubtask(rs.current?.id)"
	    />
	  </div>
	</template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <UPage>
	<!-- description -->
	<ProjectTaskList />
      </UPage>
    </template>
  </UDashboardPanel>
</template>
