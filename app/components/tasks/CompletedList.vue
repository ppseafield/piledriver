<script setup lang="ts">
import TaskItem from './TaskItem.vue'

const { t } = useI18n()
const ts = useTasksStore()

</script>

<template>
  <ul v-if="ts.completed?.length > 0">
    <TaskItem
      v-for="task in ts.completed"
	     :key="task.id"
	     :task="task"
    />
  </ul>
</template>
