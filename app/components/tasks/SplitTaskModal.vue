<script setup lang="ts">
const { t } = useI18n()

const ts = useTasksStore()
const { split } = storeToRefs(ts)

const splitTask = async () => {
  await ts.splitTask(split.task)
}
</script>

<template>
  <UModal
    v-model:open="split.open"
    :title="t('modal.splitTask.title')"
    :overlay="true"
    :ui="{ overlay: 'bg-crocodile-300 opacity-50' }"
  >
    <template #body>
      <h1>
	{{ t('modal.splitTask.bodyHeading', { title: split?.task?.title ?? '' }) }}
      </h1>

      <p>{{ t('modal.splitTask.bodyDescription') }}</p>
    </template>

    <template #footer>
      <UButton
	icon="i-carbon-close"
	:label="t('actions.close')"
      />
      <UButton
	icon="i-carbon-checkmark"
	:label="t('modal.splitTask.actions.split')"
	@click="splitTask"
      />
    </template>
  </UModal>
</template>
