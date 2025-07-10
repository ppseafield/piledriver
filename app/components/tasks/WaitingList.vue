<script setup lang="ts">
import { toRef, useTemplateRef } from 'vue'
import { useSortable } from '@vueuse/integrations/useSortable'
import TaskItem from './TaskItem.vue'
import ReorderModal from './ReorderModal.vue'

const new_ts = new_useTasksStore()
const ul = useTemplateRef<HTMLElement>('waitingList')

// TODO: implement reorder handler
const { option } = useSortable(ul, new_ts.waiting, {
  onEnd: (event: any) => {
    console.log('end sorting event', event)
    event.preventDefault()
    new_ts.reorderTask(event.item.dataset.taskId, event.newIndex + 1)
  }
})
</script>

<template>
  <ol ref="waitingList">
    <TaskItem
      v-if="new_ts.waiting.length > 0"
      v-for="task in new_ts.waiting"
      :key="task.id"
      :task="task"
    />
  </ol>
  <ReorderModal />
</template>
