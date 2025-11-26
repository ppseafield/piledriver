<script setup lang="ts">
defineI18nRoute({
  paths: {
    en: '/notes',
    de: '/notitzen'
  }
})

definePageMeta({
  middleware: 'auth'
})

const { t } = useI18n()
const localePath = useLocalePath()

const breadcrumbs = [{
  label: t('journal.pageTitle'),
  to: localePath('/notes')
}]

</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar>
	<template #leading>
	  <UDashboardSidebarCollapse />
	</template>

	<template #title>
	  <UBreadcrumb :items="breadcrumbs" />
	</template>
	
	<template #right>
	  <UButton
	    :label="t('journalNew.pageTitle')"
	    icon="i-carbon-notebook-reference"
	    :to="localePath('/notes/new')"
	  />
	</template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <UPage>
        <UPageBody>
	  <p>notes </p>
        </UPageBody>
      </UPage>
    </template>
  </UDashboardPanel>
</template>
