<script setup lang="ts">
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
  const { user } = useUserSession()

  const updatedSubtask = {
    ...props.subtask, title: titleText.value
  }
  if (updatedSubtask.id === undefined) {
    updatedSubtask.created_by = user.value.user_id
    const [savedSubtask] = await st.post([updatedSubtask])
    st.updateAtIndex(-1, savedSubtask)
  } else {
    await st.put([updatedSubtask])
  }
  editing.value = false
}
const deleteSubtask = async () => {
  st.removeSubtask(props.subtask)
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
    }
    /* ,
    {
      label: 'Add Subtask',
      icon: 'i-heroicons-plus',
      click: () => {
        console.log('todo: add subtask to subtask')
      }
    } */
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
  <div>
    <div class="flex hover:bg-tango-200 p-2 hover:rounded">
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
          :label="props.subtask.title"
          class="my-2"
          @update:model-value="updateCompleted"
        />
        <!-- todo: toggle visibility of subtasks -->
        <UDropdown :items="dropdownItems">
          <UButton
            type="button"
            icon="i-heroicons-ellipsis-vertical"
            color="primary"
            variant="soft"
            size="sm"
            :ui="{ base: 'border border-dodger-blue-200' }"
          />
        </UDropdown>
      </template>
    </div>
  </div>
</template>
