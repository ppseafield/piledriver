<script setup lang="ts">
import TaskItem from './TaskItem.vue'

const { t } = useI18n()
const ts = useTasksStore()

const completed = computed(() => {
  const items = []
  for (const [i, task] of ts.tasks.entries()) {
    if (task.completed_at !== null) {
      items.push(toRef(ts.tasks, i))
    }
  }
  return items
})
</script>

<template>
  <ul v-if="ts.completed?.length > 0">
    <TaskItem
      v-for="task in completed"
	     :key="task.value.id"
	     :task="task"
    />
  </ul>
</template>
