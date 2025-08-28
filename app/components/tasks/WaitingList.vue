<script setup lang="ts">
import { useTemplateRef } from 'vue'
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'
import { useSortable } from '@vueuse/integrations/useSortable'
import TaskItem from './TaskItem.vue'
import ReorderModal from './ReorderModal.vue'

const ts = useTasksStore()
const ul = useTemplateRef<HTMLElement>('waitingList')

const breakpoints = useBreakpoints(breakpointsTailwind)
const mobileSized = breakpoints.smaller('lg')

const sortable = useSortable(ul, ts.waiting, {
  disabled: mobileSized.value,
  onEnd: (event: any) => {
    event.preventDefault()
    if (event.newIndex !== event.oldIndex) {
      nextTick(() => ts.reorderTask(event.item.dataset.taskId, event.newIndex + 1))
    }
  }
})

watch(mobileSized, (isMobile) => {
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
