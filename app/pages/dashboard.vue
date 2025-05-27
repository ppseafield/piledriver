<script setup lang="ts">
defineI18nRoute({
  paths: {
    en: '/dashboard',
    de: '/dashboard'
  }
})
const { t } = useI18n()
const { loggedIn, user } = useUserSession()
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar :title="t('dashboard.pageTitle')">
	<template #leading>
	  <UDashboardSidebarCollapse />
	</template>
      </UDashboardNavbar>
    </template>

    <template #body>
      tasks
      <p>logged in: {{ loggedIn }}</p>
      <p>user:</p>
      <pre>
	{{ JSON.stringify(user) }}
      </pre>
    </template>
  </UDashboardPanel>
</template>
