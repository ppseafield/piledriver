<script setup lang="ts">
import SubtaskList from './SubtaskList.vue'

const props = defineProps<{
  subtask: Subtask
  task: Task
}>()
</script>

<template>
  <div>
    {{ props.subtask.title }}

    <SubtaskList
      v-if="subtask.subtasks && subtask.subtasks.length > 0"
      :task="task"
      :subtasks="subtask.subtasks"
    />
  </div>
</template>
