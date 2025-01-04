<script setup lang="ts">
import SubtaskList from './SubtaskList.vue'

const props = defineProps<{
  subtask: Subtask
  task: Task
  level: number
}>()

const st = useSubtaskStore()

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

const updateCompleted = async (value: boolean) => {
  console.log('todo: update subtask completed: check completion cascasde')
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
    <div class="flex hover:bg-tango-200 py-1">
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
          @update:model-value="updateCompleted"
          :ui="{ wrapper: 'grow' }"
          :label="props.subtask.title"
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
      v-if="subtask.subtasks && subtask.subtasks.length > 0"
      :task="task"
      :subtasks="subtask.subtasks"
      :level="level + 1"
    />
  </div>
</template>
