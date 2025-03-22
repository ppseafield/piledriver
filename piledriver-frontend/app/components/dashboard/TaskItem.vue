<script setup lang="ts">
import SubtaskList from './SubtaskList.vue'
import { useTaskStore } from '~/stores/tasks'
import { orderClass } from '~/utils/task-helpers'

const props = defineProps<{
  task: Task
  index: number
  project?: Project
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
const subtasks = st.getSubtasks(props.task.id)

watch(subtasks, (value) => {
  console.log('subtasks:', value)
})

const completion = computed<[number, number]>(() => {
  if (subtasks.value === null || subtasks.value.length === 0) {
    return [0, 0]
  } else {
    const completed = subtasks.value.filter(
      (subtask: Subtask) => subtask.completed_at !== null
    ).length
    return [completed, subtasks.value.length]
  }
})

const taskTitle = computed<string>(() => {
  const [completed, total] = completion.value
  if (total > 0) {
    return `[${completed}/${total}] ${props.task.title}`
  } else {
    return props.task.title
  }
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
  t.updateCompletion(props.task, completed)
}

const addNewSubtask = () => {
  console.log('add new subtask')
  st.addBlankSubtask(
    { id: null,
      task_id: props.task.id,
      title: ''
    },
    subtasks.value?.length ?? 0
  )
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
        click: addNewSubtask
      },
      {
        label: 'View',
        icon: 'i-heroicons-eye',
        click: () => navigateTo(`/dashboard/${props.task.id}`)
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
  // TODO: sort out subtasks (again)
  /* if (props.task.subtasks && props.task.subtasks.length > 0) {
    items.push([{
      label: 'Split Completed',
      icon: 'i-heroicons-chevron-up-down',
      click: () => t.splitCompleted(props.task)
    }])
  } */
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
          :ui="{ wrapper: 'grow', label: textStyles.label, form: textStyles.form }"
          :label="taskTitle"
          @update:model-value="updateCompleted"
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
      v-if="subtasks?.length > 0"
      :task="props.task"
      :level="0"
    />
  </div>
</template>
