<script async setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'
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
const localePath = useLocalePath()
const ts = useTasksStore()
await ts.fetch()

// TODO: sometimes checkboxes get VERY strange
// when checking unchecking quickly

const mobileMenu: DropdownMenuItem[] = [
  { label: t('dashboard.addTaskButton'),
    icon: 'i-carbon-add-filled',
    onSelect: () => ts.addEmptyTask()
  },
  { label: t('dashboard.journalTasksButton'),
    icon: 'i-carbon-notebook-reference',
    to: localePath('/journal/new')
  }
]
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar
	:title="t('dashboard.pageTitle')"
	:toggle="{ icon: 'i-carbon-side-panel-open' }"
      >
	<template #leading>
	  <UDashboardSidebarCollapse />
	</template>
	<template #right>
	  <div class="hidden lg:block contents">
	    <UButton
	      :label="t('dashboard.journalTasksButton')"
	      icon="i-carbon-notebook-reference"
	      :to="localePath('/journal/new')"
	      class="me-2"
	    />
	    <UButton
	      :label="t('dashboard.addTaskButton')"
	      icon="i-carbon-add-filled"
	      @click="ts.addEmptyTask()"
	    />
	  </div>
	  <div class="lg:hidden">
	    <UDropdownMenu :items="mobileMenu">
	      <UButton
		:label="t('dashboard.mobileMenuButton')"
		icon="i-carbon-menu"
	      />
	    </UDropdownMenu>
	  </div>
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
