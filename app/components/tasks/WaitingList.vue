<script setup lang="ts">
import TaskItem from './TaskItem.vue'

const { t } = useI18n()
const ts = useTasksStore()

</script>

<template>
  <ol v-if="ts.waiting?.length > 0">
    <TaskItem
      v-for="task in ts.waiting"
	     :key="task.id"
	     :task="task"
    />
  </ol>
</template>
