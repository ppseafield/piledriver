<script setup lang="ts">
import { TaskFromRoutineRequestSchema } from '@@/shared/types/routines'

const { t } = useI18n()
const ts = useTasksStore()
const rs = useRoutineStore()

const state = reactive({
  routine_id: ts.fromRoutine?.routine?.id || null,
  title: ts.fromRoutine?.routine?.title ?? ''
  // , // TODO: insert at position
  // task_order: (ts.waiting.at(-1)?.task_order ?? 0) + 1 
})

const { title: titleText } = toRefs(state)

const routineItems = computed(() => {
  return rs.routines.map(r => ({
    routine_id: r.id,
    label: r.title
  }))
})

const handleUpdateOpen = (value: boolean) => {
  state.routine_id = ts.fromRoutine.routine?.id || null
  state.title = ts.fromRoutine.routine?.title ?? ''
  state.task_order = ts.fromRoutine.routine?.task_order ?? 1
  console.log('updating values based on TfM open event', state)
}

// TODO: WTF?!!?!?!?!?!?!?!?!? UInput refueses to update!!!!
watch(
  () => ts.fromRoutine,
  () => {
    console.log('from routine changed')
    state.routine_id = ts.fromRoutine.routine?.id || null
    state.title = ts.fromRoutine.routine?.title ?? ''
    state.task_order = ts.fromRoutine.routine?.task_order ?? 1
  },
  { deep: true }
)

watch(titleText, (tt) => {
  console.log('title text changed to:', tt)
})

const onSubmit = (...args: any[]) => {
  if (state.routine_id !== null && state.title.length > 2) {
    ts.createTaskFromRoutine({
      routine_id: state.routine_id,
      title: state.title.trim() || ts.fromRoutine?.routine?.title,
      // TODO: allow user creation at specific order
      task_order: Math.max(1, ...ts.waiting.map(t => t.task_order)) + 1
    })
  }
}
</script>

<template>
  <UModal
    v-model:open="ts.fromRoutine.open"
    :title="t('modal.fromRoutine.modalTitle')"
    close-icon="i-carbon-close"
    :update-open="handleUpdateOpen"
    :overlay="true"
    :ui="{ overlay: 'bg-crocodile-300 opacity-50' }"
  >
    <template #body>
      <UForm
	:schema="TaskFromRoutineRequestSchema"
	:state="state"
	@submit="onSubmit"
      >
	<UFormField
	  :label="t('modal.fromRoutine.routine')"
	  name="routine_id"
	  :ui="{ container: 'w-100 mb-4' }"
	>
	  <USelectMenu
	    v-model="state.routine_id"
	    :items="routineItems"
	    value-key="routine_id"
	    :ui="{ base: 'w-100' }"
	  />
	</UFormField>

	<UFormField
	  :label="t('modal.fromRoutine.taskTitle')"
	  name="title"
	>
	  <!-- TODO: this doesn't work - it's not reactive either way!!!! -->
	  <UInput
	    :v-model="state.text"
	    :defaultValue="state.text"
	    :disabled="true"
	    :ui="{ root: 'w-100' }"
	  />
	</UFormField>
      </UForm>
    </template>

    <template #footer>
      <UButton
	icon="i-carbon-close"
	:label="t('actions.close')"
      />
      <UButton
	icon="i-carbon-checkmark"
	:label="t('actions.create')"
	@click="onSubmit"
      />
    </template>
  </UModal>
</template>
