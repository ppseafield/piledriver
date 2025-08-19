<script setup lang="ts">
import { useTemplateRef } from 'vue'
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'
import { useSortable } from '@vueuse/integrations/useSortable'
import SubtaskItem from './SubtaskItem.vue'

const { task, subtaskList } = defineProps<{ task: Task, subtaskList: Subtask[] }>()
const ul = useTemplateRef<HTMLElement>('subtaskList')
// TODO: sortable, write reorder_subtask
</script>

<template>
  <div>
    <ol ref="subtaskList">
      <SubtaskItem
	v-for="subtask in subtaskList"
	:key="subtask.id"
	:task="task"
	:subtask="subtask"
      />
    </ol>
  </div>
</template>
