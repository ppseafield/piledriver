<script setup lang="ts">
defineI18nRoute({
  paths: {
    en: '/routines',
    de: '/routinen'
  }
})
const { t } = useI18n()
</script>

<template>
  <p>{{ t('routines.pageTitle') }}</p>
</template>
