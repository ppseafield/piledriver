<script setup lang="ts">
import { useTemplateRef } from 'vue'
import { useSortable } from '@vueuse/integrations/useSortable'
import SubtaskItem from './SubtaskItem.vue'

const { task, subtaskList } = defineProps<{ task: Task, subtaskList: Subtask[], parentOrder: string }>()

const gs = useGlobalStore()
const sts = useSubtasksStore()
const ul = useTemplateRef<HTMLElement>('subtaskList')

const sortable = useSortable(ul, subtaskList, {
  disabled: gs.mobileSized,
  onEnd: (event: any) => {
    event.preventDefault()
    if (event.newIndex !== event.oldIndex) {
      nextTick(() => sts.reorderSubtask(event.item.dataset.subtaskId, event.newIndex + 1))
    }
  }
})
</script>

<template>
  <div>
    <ol ref="subtaskList">
      <SubtaskItem
	v-for="subtask in subtaskList"
	:key="subtask.id"
	:task="task"
	:subtask="subtask"
	:parent-order="parentOrder"
      />
    </ol>
  </div>
</template>
