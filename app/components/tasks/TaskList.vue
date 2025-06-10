<script setup lang="ts">

const ts = useTasksStore()

</script>

<template>
  <ul>
    <li v-for="task in ts.tasks" :key="task.id">
      {{ task.title }}
    </li>
  </ul>
</template>
