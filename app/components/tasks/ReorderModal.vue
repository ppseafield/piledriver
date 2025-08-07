<script setup lang="ts">
const ts = useTasksStore()
const { reorder } = storeToRefs(ts)

const newOrder = ref<Task>(reorder.value.task?.task_order ?? 1)

const moveOptions = computed(() => {
  return ts.waiting.map((t) => ({
    label: `${t.task_order}: ${t.title}`,
    onSelect: () => {
      newOrder.value = t.task_order
    }
  }))
})

const selected = ref<SelectMenuItem>(moveOptions.value[ newOrder.value - 1 ])

const disabled = computed(() => newOrder.value === reorder.value?.task?.task_order)

const reorderTask = () => {
  ts.reorderTask(reorder.value?.task?.id as string, newOrder.value, true)
  reorder.value.open = false
}

function handleUpdateOpen(value: boolean) {
  newOrder.value = reorder.value?.task?.task_order
  selected.value = moveOptions.value[ newOrder.value - 1 ]
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
      <div>
	move
	{{ reorder.task?.task_order ?? '' }}
	<UIcon
	  name="i-carbon-arrow-right"
	  alt="to"
	/>
	<USelectMenu
	  v-model="selected"
	  :items="moveOptions"
	  class="w-75"
	/>
      </div>
    </template>

    <template #footer>
      <UButton
	icon="i-carbon-close"
      >
	Close
      </UButton>
      <UButton
	icon="i-carbon-checkmark"
	:disabled="disabled"
	@click="reorderTask"
      >
	Reorder
      </UButton>
    </template>
  </UModal>
</template>
