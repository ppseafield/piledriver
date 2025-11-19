<script async setup lang="ts">
import type { Computed } from 'vue'
import type { DropdownMenuItem } from '@nuxt/ui'
import type { Routine } from '@@/shared/types/database/routine'
import { Temporal } from '@js-temporal/polyfill'
import WaitingList from '@/components/tasks/WaitingList.vue'
import CompletedList from '@/components/tasks/CompletedList.vue'
import ReorderModal from '@/components/tasks/ReorderModal.vue'
import TaskFromRoutineModal from '@/components/tasks/TaskFromRoutineModal.vue'

defineI18nRoute({
  paths: {
    en: '/dashboard',
    de: '/dashboard'
  }
})

definePageMeta({
  middleware: 'auth'
})

const { t } = useI18n()
const localePath = useLocalePath()
const ts = useTasksStore()
const sts = useSubtasksStore()
const rs = useRoutineStore()
const ps = useProjectStore()
await Promise.all([ts.fetch(), sts.fetch(), rs.fetch(), ps.fetch()])

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
  },
  { label: t('dashboard.addTaskFromRoutineButton'),
    icon: 'i-carbon-exam-mode',
    onSelect: () => console.log('todo: task from routine')
  }
]

const addTaskMenu: Computed<DropdownMenuItem[]> = computed(() => {
  const routineItems = rs.routines.map((r: Routine) => ({
    label: r.title,
    onSelect: () => ts.openFromRoutineModal(r)
  }))
  return [
    { label: t('dashboard.fromRoutineButton'),
      icon: 'i-carbon-exam-mode',
      onSelect: () => console.log('todo: task from routine modal'),
      children: routineItems
    }
  ]
})
</script>

<template>
  <UDashboardPanel :ui="{ body: 'sm:gap-4 sm:p-4' }">
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
	    <UFieldGroup>
	      <UButton
		:label="t('dashboard.addTaskButton')"
		icon="i-carbon-add-filled"
		@click="ts.addEmptyTask()"
	      />
	      <UDropdownMenu :items="addTaskMenu">
		<UButton
		  :aria-label="t('dashboard.addTaskFromRoutineButton')"
		  icon="i-carbon-chevron-down"
		/>
	      </UDropdownMenu>
	    </UFieldGroup>
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
  <TaskFromRoutineModal />
</template>
