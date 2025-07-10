<script setup lang="ts">
import TaskItem from './TaskItem.vue'

const { t } = useI18n()
const new_ts = new_useTasksStore()

</script>

<template>
  <ul>
    <TaskItem
      v-if="new_ts.completed.length > 0"
      v-for="task in new_ts.completed"
	     :key="task.id"
	     :task="task"
    />
  </ul>
</template>
