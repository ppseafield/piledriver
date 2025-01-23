<script setup lang="ts">
import TaskList from '~/components/dashboard/TaskList.vue'
import { useProjectStore } from '~/stores/projects'

definePageMeta({
  layout: 'dashboard-layout',
  middleware: ['require-auth']
})

const route = useRoute()
const p = useProjectStore()
const t = useTaskStore()
await p.ensureCurrent(route.params.projectId)
// await p.fetchTasks
await t.get({
  queryType: 'project',
  params: new URLSearchParams([['project_id', p.currentItem.id]])
})
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar
        :title="p.currentItem?.title"
      />

      <UDashboardToolbar>
        <template #right>
          <UButton
            color="primary"
            label="Edit"
            icon="i-heroicons-pencil"
          />
        </template>
      </UDashboardToolbar>

      <UDashboardPanelContent>
        <TaskList :tasks="t.items" />
      </UDashboardPanelContent>
    </UDashboardPanel>
  </UDashboardPage>
</template>
