<script setup lang="ts">
import { useTemplateRef } from 'vue'
import { useSortable } from '@vueuse/integrations/useSortable'
import { formatters } from '@@/shared/utils/date-formatters'
import RoutineSubtaskItem from './RoutineSubtaskItem.vue'

const { routine, subtaskList } = defineProps<{ routine: Routine, subtaskList }>()
const gs = useGlobalStore()
const rs = useRoutineStore()
const ul = useTemplateRef<HTMLElement>('routineSubtaskList')

const sortable = useSortable(ul, subtaskList, {
  disabled: gs.mobileSized,
  onEnd: (event: any) => {
    event.preventDefault()
    if (event.newIndex !== event.oldIndex) {
      nextTick(() => rs.reorderSubtask(event.item.dataset.routineSubtaskId, event.newIndex + 1))
    }
  }
})

console.log('formatters:', formatters)
</script>

<template>
  <div>
    <!-- task title template show/edit -->
    <!-- info button with popup: {D} for day, {M} for month, etc. -->
    <ol ref="routineSubtaskList">
      <RoutineSubtaskItem
	v-for="subtask in subtaskList"
	:key="subtask.id"
	:subtask="subtask"
      />
    </ol>
  </div>
</template>
