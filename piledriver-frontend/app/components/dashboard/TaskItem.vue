<script setup lang="ts">
import { useTaskStore } from '~/stores/tasks'
import { orderClass } from '~/utils/task-helpers'

const props = defineProps<{
  task: Task
  index: number
}>()

const t = useTaskStore()

const editing = ref<boolean>(false)
const textStyles = computed(() => {
  return orderClass(props.index)
})
const titleText = ref<string>(props.task.title)
watch(props, () => {
  titleText.value = props.task.title
})

onMounted(() => {
  if (props.task.title === '') {
    editing.value = true
  }
})

// Edit, Save, and Cancel task edit
const editTask = () => {
  console.log('todo: edit task')
  editing.value = true
}
const saveTask = async() => {
  // TODO: handle completion
  const updatedTask = { ...props.task, title: titleText.value }
  delete updatedTask.subtasks
  await t.put([updatedTask])

  editing.value = false
}
const cancelEdit = () => {
  console.log('todo: cancel edit')
  editing.value = false
  if (props.task.id === undefined) {
    t.removeTask(props.task)
  }
}
const deleteTask = () => {
  t.removeTask(props.task)
}
</script>

<template>
  <div class="ps-2 hover:bg-tango-300 py-1">
    <div class="flex">
      <template v-if="editing">
        <UInput
          v-model="titleText"
          class="grow ms-5"
          :ui="{ default: { size: textStyles.label } }"
          @keydown.enter="saveTask"
        />
        <UButtonGroup size="sm">
          <UButton
            color="primary"
            variant="ghost"
            icon="i-heroicons-check"
            @click="saveTask"
          />
          <UButton
            color="primary"
            variant="ghost"
            icon="i-heroicons-x-mark"
            @click="cancelEdit"
          />
          <UButton
            v-if="props.task.id !== undefined"
            color="primary"
            variant="ghost"
            icon="i-heroicons-trash"
            @click="deleteTask"
          />
        </UButtonGroup>
      </template>
      <template v-else>
        <UCheckbox
          :ui="{ wrapper: 'grow', label: textStyles.label, form: textStyles.form }"
          :label="props.task.title"
        />
        <UButton
          type="button"
          icon="i-heroicons-pencil-square"
          color="primary"
          variant="ghost"
          size="sm"
          @click="editTask"
        />
      </template>
    </div>
  </div>
</template>
