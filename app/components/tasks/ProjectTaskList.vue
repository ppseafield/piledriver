<script setup lang="ts">
import { useTemplateRef } from 'vue'
import { useSortable } from '@vueuse/integrations/useSortable'
import TaskItem from './TaskItem.vue'
import ReorderModal from './ReorderModal.vue'

const gs = useGlobalStore()
const ts = useTasksStore()
const ps = useProjectStore()
const ul = useTemplateRef<HTMLElement>('projectTaskList')

const sortable = useSortable(ul, ts.relatedTasks, {
  disabled: gs.mobileSized,
  onEnd: (event: any) => {
    event.preventDefault()
    if (event.newIndex !== event.oldIndex) {
      nextTick(() => ps.reorderTask(event.item.dataset.taskId, event.newIndex + 1))
    }
  }
})
</script>

<template>
  <ol ref="projectTaskList">
    <TaskItem
      v-if="ps.relatedTasks.length > 0"
      v-for="task in ps.relatedTasks"
      :key="task.id"
      :project="ps.current"
      :task="task"
    />
  </ol>
  <ReorderModal />
</template>
