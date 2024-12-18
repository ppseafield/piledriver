<script setup lang="ts">
definePageMeta({
  layout: 'dashboard-layout'
})

const { data, refresh } = useFetch<Task[]>('/api/tasks')
</script>

<template>
  <div>
    <p>dashboard</p>
    <UButton @click="refresh">
      Refresh
    </UButton>
    <pre>{{ data }}</pre>
  </div>
</template>
