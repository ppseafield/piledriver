<script setup lang="ts">
import SubtaskList from './SubtaskList.vue'

const props = defineProps<{
  subtask: Subtask
  task: Task
  level: number
}>()

const st = useSubtaskStore()

const subtasks = computed(() => {
  if (props.subtask?.id === undefined || st.subtaskMap === undefined) {
    return []
  } else {
    return st.subtaskMap.get(props.subtask.id) ?? []
  }
})

const completion = computed<[number, number]>(() => {
  if (subtasks.value.length === 0) {
    return [0, 0]
  } else {
    const completed = subtasks.value.filter(
      (subtask: Subtask) => subtask.completed_at !== null
    ).length
    return [completed, subtasks.value.length]
  }
})

const subtaskTitle = computed<string>(() => {
  const [completed, total] = completion.value
  if (total > 0 && completed < total) {
    return `[${completed}/${total}] ${props.subtask.title}`
  } else {
    return props.subtask.title
  }
})

const titleText = ref<string>(props.subtask.title)
watch(props, () => {
  titleText.value = props.subtask.title
})

const editing = ref<boolean>(false)
onMounted(() => {
  if (props.subtask.title === '') {
    editing.value = true
  }
})
const isChecked = computed<boolean>(() => {
  return props.subtask.completed_at !== null
})

// Edit, Save, and Cancel subtasks
const editSubtask = () => {
  console.log('editing subtask:', props.subtask)
  editing.value = true
}
const cancelEdit = () => {
  if (props.subtask.id === undefined) {
    console.log('removing new subtask')
  } else {
    titleText.value = props.subtask.title
  }
  editing.value = false
}
const saveSubtask = async () => {
  const updatedSubtask = { ...props.subtask, title: titleText.value }
  if (updatedSubtask.id === undefined) {
    console.log('todo: save new subtask')
    // const [savedSubtask] = await st.post([updatedSubtask])
    // st.updateAtIndex(-1, savedSubtask)
  } else {
    await st.put([updatedSubtask])
  }
  editing.value = false
}
const deleteSubtask = async () => {
  console.log('todo: delete subtask')
}

const updateCompleted = async (completed: boolean) => {
  st.updateCompletion(props.subtask, completed)
  // console.log('todo: update subtask completed: check completion cascasde', completed)
  // const updatedSubtask = { ...props.subtask, completed_at: value ? new Date() : null }
  // await st.put([updatedSubtask])
}

const dropdownItems = computed(() => [
  [
    {
      label: 'Edit',
      icon: 'i-heroicons-pencil',
      click: editSubtask
    },
    {
      label: 'Add Subtask',
      icon: 'i-heroicons-plus',
      click: () => {
        console.log('todo: add subtask to subtask')
      }
    }
  ],
  [
    {
      label: 'Delete',
      icon: 'i-heroicons-trash',
      click: deleteSubtask
    }
  ]
])
</script>

<template>
  <div class="ps-2">
    <div class="flex hover:bg-tango-200 py-1 ps-2">
      <template v-if="editing">
        <UInput
          v-model="titleText"
          autofocus
          class="grow ms-5"
          @keydown.enter.prevent="saveSubtask"
          @keydown.shift.enter.prevent="saveSubtask"
          @keydown.esc.prevent="cancelEdit"
        />
        <UButtonGroup size="sm">
          <UButton
            color="primary"
            variant="ghost"
            icon="i-heroicons-check"
            @click="saveSubtask"
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
          :ui="{ wrapper: 'grow' }"
          :label="subtaskTitle"
          @update:model-value="updateCompleted"
        />
        <!-- todo: toggle visibility of subtasks -->
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
    </div>

    <SubtaskList
      v-if="subtasks.length > 0"
      :task="task"
      :subtasks="subtasks"
      :level="level + 1"
    />
  </div>
</template>
