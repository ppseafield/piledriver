<script setup lang="ts">
import { toRef, useTemplateRef } from 'vue'
import { useSortable } from '@vueuse/integrations/useSortable'
import TaskItem from './TaskItem.vue'
import ReorderModal from './ReorderModal.vue'

const ts = useTasksStore()
const ul = useTemplateRef<HTMLElement>('waitingList')

const waiting = computed(() => {
  const items = []
  for (const [i, task] of ts.tasks.entries()) {
    if (task.completed_at === null) {
      items.push(toRef(ts.tasks, i))
    }
  }
  return items
})

// TODO: implement reorder handler
const { option } = useSortable(ul, waiting, {
  onEnd: (event: any) => {
    console.log('end sorting event', event)
    event.preventDefault()
    ts.reorderTask(event.item.dataset.taskId, event.newIndex + 1)
  }
})
</script>

<template>
  <ol ref="waitingList">
    <TaskItem
      v-for="task in waiting"
      :key="task.value.id"
      :task="task"
    />
  </ol>
  <ReorderModal />
</template>
