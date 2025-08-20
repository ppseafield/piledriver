<script setup lang="ts">
defineI18nRoute({
  paths: {
    en: '/routines',
    de: '/routinen'
  }
})

definePageMeta({
  middleware: 'auth'
})

const { t } = useI18n()
</script>

<template>
  <p>{{ t('routines.pageTitle') }}</p>
</template>
