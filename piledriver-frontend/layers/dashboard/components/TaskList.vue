<script setup lang="ts">
import { useTaskStore } from '~~/layers/dashboard/stores/tasks'

const ts = useTaskStore()
</script>

<template>
  <div>
    <div v-for="task in ts.items" :key="task.id">
      <div>{{ task.title }}</div>
    </div>
  </div>
</template>
