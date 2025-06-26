<script setup lang="ts">
import type { Task } from '@@/shared/types/database/tasks'

const ts = useTasksStore()
const { reorder } = storeToRefs(ts)

function handleUpdateOpen(value: boolean) {
  console.log('handle update open:', value)
}
</script>

<template>
  <UModal
    v-model:open="reorder.open"
    :title="`Reorder ${reorder.task?.title}`"
    close-icon="i-carbon-close"
    :update-open="handleUpdateOpen"
    :overlay="true"
    :ui="{ overlay: 'bg-crocodile-300 opacity-50' }"
  >
    <template #body>
      <p>current: {{ reorder.task?.task_order ?? '' }}</p>
      <p>new: ___</p>
    </template>

    <template #footer="{ close }">
      <UButton
	icon="i-carbon-close"
	@click="close"
      >
	Close
      </UButton>
      <UButton
	icon="i-carbon-checkmark"
	@click="ts.reorderTask(reorder?.task as Task, 9999)"
      >
	Reorder
      </UButton>
    </template>
  </UModal>
</template>
