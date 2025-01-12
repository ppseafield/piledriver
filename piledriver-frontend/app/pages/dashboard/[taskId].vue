<script setup lang="ts">
import TaskItem from '~/components/dashboard/TaskItem.vue'

definePageMeta({
  layout: 'dashboard-layout'
})

const t = useTaskStore()
const route = useRoute()

await t.ensureCurrent(route.params.taskId)
// TODO: timer
// TODO: completable project
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar title="Dashboard" />

      <UDashboardToolbar>
        <template #right>
          <UButton
            label="Start"
          />
          <UButton
            title="Clear"
          />
        </template>
      </UDashboardToolbar>

      <UDashboardPanelContent>
        <TaskItem
          v-if="t.currentItem"
          :task="t.currentItem"
          :index="0"
        />
      </UDashboardPanelContent>
    </UDashboardPanel>
  </UDashboardPage>
</template>
