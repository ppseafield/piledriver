<script setup lang="ts">
import { useTaskStore } from '~/stores/tasks'
import TaskList from '~/components/dashboard/TaskList.vue'

definePageMeta({
  layout: 'dashboard-layout'
})

const t = useTaskStore()
const st = useSubtaskStore()
await Promise.all([t.get(), st.get()])

const newTaskPresent = computed(() => {
  return t.items?.[0]?.id === undefined
})
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar title="Dashboard" />

      <UDashboardToolbar>
        <template #right>
          <UButtonGroup>
            <UButton
              color="primary"
              label="Add New Task"
              :disabled="newTaskPresent"
              @click="t.addBlankTask"
            />
            <UDropdown :items="[[{ label: 'No Routines available.' }]]">
              <UButton
                title="From Routine"
                icon="i-heroicons-arrow-path-rounded-square"
              />
            </UDropdown>
          </UButtonGroup>
        </template>
      </UDashboardToolbar>

      <UDashboardPanelContent>
        <TaskList />
      </UDashboardPanelContent>
    </UDashboardPanel>
  </UDashboardPage>
</template>
