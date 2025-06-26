<script async setup lang="ts">
import { Temporal } from '@js-temporal/polyfill'
import WaitingList from '@/components/tasks/WaitingList.vue'
import CompletedList from '@/components/tasks/CompletedList.vue'
import ReorderModal from '@/components/tasks/ReorderModal.vue'

defineI18nRoute({
  paths: {
    en: '/dashboard',
    de: '/dashboard'
  }
})

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
	    @click="ts.addEmptyTask()"
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
  <ReorderModal />
</template>
