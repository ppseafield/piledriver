<script setup lang="ts">

defineI18nRoute({
  paths: {
    en: '/history',
    de: '/chronik'
  }
})

definePageMeta({
  middleware: 'auth'
})

// TODO: paginated table of all things
</script>

<template>
  <div>history WIP</div>
</template>
