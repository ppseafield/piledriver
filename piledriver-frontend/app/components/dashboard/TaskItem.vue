<script setup lang="ts">
import SubtaskList from './SubtaskList.vue'
import { useTaskStore } from '~/stores/tasks'
import { orderClass } from '~/utils/task-helpers'

const props = defineProps<{
  task: Task
  index: number
}>()

const t = useTaskStore()
const st = useSubtaskStore()

const editing = ref<boolean>(false)
const textStyles = computed(() => {
  return orderClass(props.task.completed_at === null ? props.index : 7)
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
      t.addBlankTask()
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

const dropdownItems = computed(() => {
  const items = [
    [
      {
        label: 'Edit',
        icon: 'i-heroicons-pencil',
        click: editTask
      },
      {
        label: 'Add subtask',
        icon: 'i-heroicons-plus',
        click: () => st.addBlankSubtask(props.task)
      }
    ],
    [
      {
        label: 'Delete',
        icon: 'i-heroicons-trash',
        click: deleteTask
      }
    ]
  ]
  if (props.task.subtasks && props.task.subtasks.length > 0) {
    items.push([{
      label: 'Split Completed',
      icon: 'i-heroicons-chevron-up-down',
      click: () => t.splitCompleted(props.task)
    }])
  }
  return items
})
</script>

<template>
  <div class="ps-2">
    <div class="flex hover:bg-tango-200 py-1">
      <template v-if="editing">
        <UInput
          v-model="titleText"
          autofocus
          class="grow ms-5"
          :ui="{ default: { size: textStyles.label } }"
          @keydown.enter.prevent="saveTask"
          @keydown.shift.enter.prevent="saveTaskAndAddNew"
          @keydown.esc="cancelEdit"
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
        </UButtonGroup>
      </template>
      <template v-else>
        <UCheckbox
          :model-value="isChecked"
          @update:model-value="updateCompleted"
          :ui="{ wrapper: 'grow', label: textStyles.label, form: textStyles.form }"
          :label="props.task.title"
        />
        <!-- toggle visibility of subtasks -->
        <template v-if="!isChecked">
          <UDropdown :items="dropdownItems">
            <UButton
              type="button"
              icon="i-heroicons-ellipsis-vertical"
              color="primary"
              variant="outline"
              size="sm"
            />
          </UDropdown>
        </template>
      </template>
    </div>

    <SubtaskList
      v-if="task.subtasks && task.subtasks.length > 0"
      :task="task"
      :subtasks="task.subtasks"
      :level="1"
    />
  </div>
</template>
