<script setup lang="ts">
const new_ts = new_useTasksStore()
const { reorder } = storeToRefs(new_ts)

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

    <template #footer>
      <UButton
	icon="i-carbon-close"
      >
	Close
      </UButton>
      <UButton
	icon="i-carbon-checkmark"
	@click="new_ts.reorderTask(reorder?.task?.id as string, 9999)"
      >
	Reorder
      </UButton>
    </template>
  </UModal>
</template>
