<script setup lang="ts">
defineI18nRoute({
  paths: {
    en: '/journal',
    de: '/tagebuch'
  }
})
const { t } = useI18n()
</script>

<template>
  <p>{{ t('journal.pageTitle') }}</p>
</template>
