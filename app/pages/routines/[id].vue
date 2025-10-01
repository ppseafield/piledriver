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

const addSubtaskMenu: DropdownMenuItem[] = [
  { label: t('routine.copyFromRoutine'),
    icon: 'i-carbon-exam-mode',
    onSelect: () => console.log('todo: task from routine')
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
	    <UButtonGroup>
	      <UButton
		:label="t('routine.addSubtask')"
		icon="i-carbon-add-filled"
		@click="rs.addEmptySubtask(rs.current?.id)"
	      />
	      <UDropdownMenu :items="addSubtaskMenu">
		<UButton
		  :aria-label="t('routine.addSubtaskOptions')"
		  icon="i-carbon-chevron-down"
		/>
	      </UDropdownMenu>
	    </UButtonGroup>
	  </div>
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
