<script async setup lang="ts">
import { Temporal } from '@js-temporal/polyfill'
import WaitingList from '../components/tasks/WaitingList.vue'
import CompletedList from '../components/tasks/CompletedList.vue'

defineI18nRoute({
  paths: {
    en: '/dashboard',
    de: '/dashboard'
  }
})

console.log('Temporal', Temporal)

const { t } = useI18n()
const ts = useTasksStore()
await ts.fetch()
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar :title="t('dashboard.pageTitle')">
	<template #leading>
	  <UDashboardSidebarCollapse />
	</template>
	<template #right>
	  <UButton
	    :label="t('dashboard.addTaskButton')"
	    icon="i-carbon-add-filled"
	  />
	</template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <WaitingList />
      <USeparator
	icon="i-carbon-checkmark-outline"
	class="my-3"
      />
      <CompletedList />
    </template>
  </UDashboardPanel>
</template>
