<script setup lang="ts">
import * as locales from '@nuxt/ui-pro/locale'

const { locale, t } = useI18n()
const localePath = useLocalePath()

const links = [
  { label: t('dashboard.pageTitle'),
    to: localePath('/dashboard')
  },
  { label: t('routines.pageTitle'),
    to: localePath('/routines')
  },
  { label: t('journal.pageTitle'),
    to: localePath('/journal')
  }
]

const open = ref<boolean>(false)
</script>

<template>
  <UApp :locale="locales[locale]">
    <NuxtLoadingIndicator />

    <UDashboardGroup unit="rem">
      <UDashboardSidebar
	id="default"
	v-model:open="open"
	collapsible
      >
	<template #header>
	  <span class="w-full ms-2">
	    piledriver
	  </span>
	</template>

	<template #default="{ collapsed }">
	  <UNavigationMenu
	    highlight
	    highlight-color="primary"
	    :collapsed="collapsed"
	    :items="links"
	    orientation="vertical"
	  />
	</template>

	<template #footer>
	  <ProfileActions />
	</template>
      </UDashboardSidebar>

      <NuxtPage />
    </UDashboardGroup>
  </UApp>
</template>
