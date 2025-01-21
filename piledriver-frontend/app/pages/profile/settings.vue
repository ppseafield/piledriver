<script setup lang="ts">
definePageMeta({
  layout: 'dashboard-layout',
  middleware: ['require-auth']
})
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar title="Settings" />

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
        <p>Settings</p>
      </UDashboardPanelContent>
    </UDashboardPanel>
  </UDashboardPage>
</template>
