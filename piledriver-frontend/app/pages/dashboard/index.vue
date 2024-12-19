<script setup lang="ts">
import { useTaskStore } from '~~/layers/dashboard/stores/tasks'

definePageMeta({
  layout: 'dashboard-layout'
})

const t = useTaskStore()
await t.get()
</script>

<template>
  <div>
    <p>dashboard</p>
    <pre>{{ t.items }}</pre>
  </div>
</template>
