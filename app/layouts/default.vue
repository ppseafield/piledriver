<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()
</script>

<template>
  <UApp :locale="locale">
    <NuxtPage />
  </UApp>
</template>
