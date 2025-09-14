<script setup lang="ts">
import { useTemplateRef } from 'vue'
import { useSortable } from '@vueuse/integrations/useSortable'
import TaskItem from './TaskItem.vue'
import ReorderModal from './ReorderModal.vue'

const gs = useGlobalStore()
const ts = useTasksStore()
const ul = useTemplateRef<HTMLElement>('waitingList')

const sortable = useSortable(ul, ts.waiting, {
  disabled: gs.mobileSized,
  onEnd: (event: any) => {
    event.preventDefault()
    if (event.newIndex !== event.oldIndex) {
      nextTick(() => ts.reorderTask(event.item.dataset.taskId, event.newIndex + 1))
    }
  }
})

watch(() => gs.mobileSized, (isMobile) => {
  sortable.option('disabled', isMobile)
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
