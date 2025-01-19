<script setup lang="ts">
definePageMeta({
  layout: 'dashboard-layout'
})
const { user } = useUserSession()
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar title="Profile" />

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
        <p>{{ user.username }}</p>
        <p>{{ user.email }}</p>
      </UDashboardPanelContent>
    </UDashboardPanel>
  </UDashboardPage>
</template>
