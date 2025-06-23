<script setup lang="ts">
import { toRef } from 'vue'
import TaskItem from './TaskItem.vue'

const ts = useTasksStore()

const waiting = computed(() => {
  const items = []
  for (const [i, task] of ts.tasks.entries()) {
    if (task.completed_at === null) {
      items.push(toRef(ts.tasks, i))
    }
  }
  return items
})
</script>

<template>
  <ol v-if="waiting?.length > 0">
    <TaskItem
      v-for="task in waiting"
	     :key="task.value.id"
	     :task="task"
    />
  </ol>
</template>
