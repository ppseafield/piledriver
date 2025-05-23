<script setup lang="ts">
import * as locales from '@nuxt/ui-pro/locale'

const { locale } = useI18n()
</script>

<template>
  <UApp :locale="locales[locale]">
    <NuxtLoadingIndicator />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
