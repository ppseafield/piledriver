<script setup lang="ts">
defineI18nRoute({
  paths: {
    en: '/logout',
    de: '/abmelden'
  }
})

definePageMeta({
  layout: 'public'
})

await $fetch('/api/logout')

const { t } = useI18n()
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-4 p-4">
    <UPageCard class="w-full max-w-md">
      {{ t('logout.loggedOutMessage') }}
    </UPageCard>
  </div>
</template>
