<script setup lang="ts">
import { useTemplateRef } from 'vue'
import { useSortable } from '@vueuse/integrations/useSortable'
import TaskItem from './TaskItem.vue'
import ReorderModal from './ReorderModal.vue'

const ts = useTasksStore()
const ul = useTemplateRef<HTMLElement>('waitingList')

useSortable(ul, ts.waiting, {
  onEnd: (event: any) => {
    console.log('end sorting event', event)
    event.preventDefault()
    if (event.newIndex !== event.oldIndex) {
      ts.reorderTask(event.item.dataset.taskId, event.newIndex + 1)
    }
  }
})
</script>

<template>
  <ol ref="waitingList">
    <TaskItem
      v-if="ts.waiting.length > 0"
      v-for="task in ts.waiting"
      :key="task.id"
      :task="task"
    />
  </ol>
  <ReorderModal />
</template>
