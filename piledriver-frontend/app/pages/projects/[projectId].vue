<script setup lang="ts">
import { useProjectStore } from '~/stores/projects'

definePageMeta({
  layout: 'dashboard-layout',
  middleware: ['require-auth']
})

const route = useRoute()
const p = useProjectStore()
await p.ensureCurrent(route.params.projectId)
// await p.fetchTasks
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
        <p>{{ p.currentItem?.description }}</p>
      </UDashboardPanelContent>
    </UDashboardPanel>
  </UDashboardPage>
</template>
