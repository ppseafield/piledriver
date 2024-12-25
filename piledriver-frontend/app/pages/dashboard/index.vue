<script setup lang="ts">
import { useTaskStore } from '~/stores/tasks'
import TaskList from '~/components/dashboard/TaskList.vue'
import { useSessionStore } from '~~/layers/auth/stores/session'

definePageMeta({
  layout: 'dashboard-layout'
})

const s = useSessionStore()
const t = useTaskStore()
await t.get()

function prependNewTask() {
  t.addTask(s.user?.user_id)
}

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
