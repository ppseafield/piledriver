<script setup lang="ts">
defineI18nRoute({
  paths: {
    en: '/routines/new',
    de: '/routinen/neu'
  }
})

definePageMeta({
  middleware: 'auth'
})

const { t } = useI18n()
const localePath = useLocalePath()
const rs = useRoutineStore()

useHead({
  title: t('routineNew.pageTitle')
})

const breadcrumbs = [
  { label: t('routines.pageTitle'),
    to: localePath('/routines')
  },
  { label: t('routineNew.pageTitle'),
    to: localePath(`/routines/new`)
  }
]

const titleText = ref<string>('')
const descriptionText = ref<string>('')

const saveNewRoutine = async () => {
  const title = titleText.value.trim()
  if (title.length > 3) {
    const newRoutine = await rs.create({
      title,
      description: descriptionText.value.trim() || null
    })

    navigateTo(localePath(`/routines/${newRoutine.id}`))
  }
}
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
	    :label="t('actions.save')"
	    icon="i-carbon-save"
	    @click="saveNewRoutine"
	  />
	</template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <UPage>
	<UPageBody>
	  <UFormField
	    :label="t('routineNew.routineTitle')"
	    :ui="{ container: 'mb-4' }"
	  >
	    <UInput
	      v-model="titleText"
	      :ui="{ root: 'w-100' }"
	    />
	  </UFormField>

	  <UFormField :label="t('routineNew.descriptionTitle')">
	    <UTextarea
	      v-model="descriptionText"
	      :rows="4"
	      autoresize
	      :ui="{ root: 'w-100' }"
	    />
	  </UFormField>
	</UPageBody>
      </UPage>
    </template>
  </UDashboardPanel>
</template>
