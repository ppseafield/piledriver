<script setup lang="ts">
import AppHeader from "~/components/layouts/AppHeader.vue";

</script>

<template>
  <UApp :toaster="{ expand: false }">
    <AppHeader />

    <UMain>
      <NuxtPage />
    </UMain>
  </UApp>
</template>
