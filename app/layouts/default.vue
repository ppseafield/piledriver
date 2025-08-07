<script setup lang="ts">
import * as locales from '@nuxt/ui-pro/locale'
import logo from '/assets/images/piledriver-bulldozer-32.png'

const { locale, t } = useI18n()
const localePath = useLocalePath()

const links = [
  { label: t('dashboard.pageTitle'),
    to: localePath('/dashboard'),
    icon: 'i-carbon-image-store-local'
  },
  { label: t('routines.pageTitle'),
    to: localePath('/routines'),
    icon: 'i-carbon-exam-mode'
  },
  { label: t('journal.pageTitle'),
    to: localePath('/journal'),
    icon: 'i-carbon-notebook'
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
	<template #header="{ collapsed }">
	  <img
	    :src="logo"
	    :alt="t('layout.piledriverLogoText')"
	  />
	  <span
	    v-if="!collapsed"
	    class="w-full ms-2">
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
	  <UColorModeButton />
	  <ProfileActions />
	</template>
      </UDashboardSidebar>

      <NuxtPage />
    </UDashboardGroup>
  </UApp>
</template>
