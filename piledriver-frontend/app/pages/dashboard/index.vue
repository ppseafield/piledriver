<script setup lang="ts">
import { useTaskStore } from '~~/layers/dashboard/stores/tasks'
import TaskList from '~~/layers/dashboard/components/TaskList.vue'

definePageMeta({
  layout: 'dashboard-layout'
})

const t = useTaskStore()
await t.get()

function prependNewTask() {
  console.log('todo: prepend new task')
}
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar title="Dashboard" />

      <UDashboardToolbar>
        <template #left>
          <span> </span>
        </template>
        <template #right>
          <UButtonGroup>
            <UButton
              color="primary"
              label="Add New Task"
              @click="prependNewTask"
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
