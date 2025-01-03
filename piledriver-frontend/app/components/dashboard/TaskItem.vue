<script setup lang="ts">
import SubtaskList from './SubtaskList.vue'
import { useTaskStore } from '~/stores/tasks'
import { orderClass } from '~/utils/task-helpers'
import { useSessionStore } from '~~/layers/auth/stores/session'

const props = defineProps<{
  task: Task
  index: number
}>()

const session = useSessionStore()
const t = useTaskStore()

const editing = ref<boolean>(false)
const textStyles = computed(() => {
  return orderClass(props.index)
})
const titleText = ref<string>(props.task.title)
watch(props, () => {
  titleText.value = props.task.title
})
const isChecked = computed<boolean>(() => {
  return props.task.completed_at !== null
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
const saveTask = async () => {
  const updatedTask = { ...props.task, title: titleText.value }
  delete updatedTask.subtasks
  if (updatedTask.id === undefined) {
    const [savedTask] = await t.post([updatedTask])
    t.updateAtIndex(-1, savedTask)
  } else {
    await t.put([updatedTask])
  }
  editing.value = false
}
const saveTaskAndAddNew = async () => {
  await saveTask()
  if (props.task.id === undefined) {
    setTimeout(() => {
      t.addTask(session.user?.user_id)
    }, 40)
  }
}
const cancelEdit = () => {
  if (props.task.id === undefined) {
    t.removeTask(props.task) // goodbye
  } else {
    titleText.value = props.task.title
    editing.value = false
  }
}
const deleteTask = () => {
  t.removeTask(props.task)
}

const updateCompleted = (completed: boolean) => {
  // Hmm, this happens annoyingly enough times; should address it.
  const { subtasks, ...taskOnly } = props.task
  t.updateCompletion(taskOnly, completed)
}
</script>

<template>
  <div class="ps-2 hover:bg-tango-300 py-1">
    <div class="flex">
      <template v-if="editing">
        <UInput
          v-model="titleText"
          autofocus
          class="grow ms-5"
          :ui="{ default: { size: textStyles.label } }"
          @keydown.enter.prevent="saveTask"
          @keydown.shift.enter.prevent="saveTaskAndAddNew"
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
          :model-value="isChecked"
          @update:model-value="updateCompleted"
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

    <SubtaskList
      v-if="task.subtasks && task.subtasks.length > 0"
      :task="task"
      :subtasks="task.subtasks"
    />
    <div v-else>
      no subtasks here
    </div>
  </div>
</template>
