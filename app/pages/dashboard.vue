<script setup lang="ts">
defineI18nRoute({
  paths: {
    en: '/dashboard',
    de: '/dashboard'
  }
})
const { t } = useI18n()

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
    </template>
  </UDashboardPanel>
</template>
