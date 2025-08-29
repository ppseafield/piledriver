<script setup lang="ts">
const { task, subtask, parentOrder } = defineProps<{ task: Task, subtask: Subtask, parentOrder: string }>()

const ts = useTasksStore()
const sts = useSubtasksStore()
const { t } = useI18n()

const editing = ref<boolean>(false)
const titleText = ref<string>(subtask.title)
const liBody = useTemplateRef<HTMLLIElement>('li-body')

watch(() => subtask, () => {
  // When the subtask updates its title text, we should update our
  // form title text as well.
  if (subtask.title) {
    titleText.value = subtask.title
  }
})
onMounted(() => {
  //If this is a new task, just start editing.
  if (sts.unsavedSubtaskIDs.has(subtask.id)) {
    editing.value = true
    liBody.value?.scrollIntoView({ behavior: 'smooth' })
  }
})

const subtaskCompleted = computed(() => subtask.completed_at !== null)
const orderLabel = computed(() => `${parentOrder}.${subtask.task_order}`)

const subtaskDropdownItems: DropdownMenuItem[][] = [
  [
    { label: t('dashboard.taskItem.menu.edit'),
      icon: 'i-carbon-edit',
      onSelect: () => editing.value = true
    },
    { label: t('dashboard.taskItem.menu.reorder'),
      icon: 'i-carbon-arrows-vertical',
      onSelect: () => console.log('open subtask reorder modal') // sts.openReorderModal(task, subtask)
    }
  ],
  [
    { label: t('dashboard.taskItem.menu.delete'),
      icon: 'i-carbon-trash-can',
      onSelect: () => {
	const subtaskName = subtask.completed_at === null
			  ? `#${subtask.task_order}: '${subtask.title}'`
			  : `'${subtask.title}'`
	if (window.confirm( t('dashboard.deleteSubtaskPrompt', { subtaskName }) )) {
	  sts.archiveSubtask(subtask)
	}
      }
    }
  ]
]

const updateSubtaskCompletion = (completed: boolean | "indeterminate") => {
  // TODO: update subtask completion
  console.log('update subtask completion:', completed)
}

const saveSubtask = async (event: any) => {
  const title = titleText.value.trim()
  // TODO: proper validation, error toast?
  if (title.length > 1) {
    await sts.saveSubtask({ ...subtask, title })
    editing.value = false

    if (event.shiftKey) {
      sts.addEmptySubtask(task.id)
    }
  }
}

</script>

<template>
  <li
    ref="li-body"
    class="ms-4"
  >
    <div class="flex flex-column gap-1 lg:gap-3 p-1 lg:p-2 hover:bg-crocodile-200 dark:hover:bg-crocodile-800">
      <UCheckbox
	size="lg"
	icon="i-carbon-checkmark"
	:label="orderLabel"
	:disabled="editing"
	@update:modelValue="updateSubtaskCompletion"
      />
      <template v-if="editing">
	<UInput
	  v-model="titleText"
	  class="grow"
	  :autofocus="true"
	  @keyup.enter="saveSubtask"
	/>
	<UButtonGroup>
	  <UButton
	    icon="i-carbon-close"
	    :aria-label="t('dashboard.taskItem.menu.delete')"
	    @click="editing = false; titleText = subtask.title"
	  />
	  <UButton
	    icon="i-carbon-checkmark"
	    :aria-label="t('dashboard.taskItem.menu.edit')"
	    @click="saveSubtask"
	  />
	</UButtonGroup>
      </template>
      <template v-else>
	<div class="flex flex-column grow">
	  <span
	    class="mx-1 lg:mx-2 grow"
	    @dblclick="editing = true"
	  >
	    {{ titleText }}
	  </span>
	</div>
	<UDropdownMenu
	  :items="subtaskDropdownItems"
	  class="h-9"
	>
	  <UButton
	    variant="subtle"
	    icon="i-carbon-overflow-menu-horizontal"
	    :aria-label="t('dashboard.taskItem.menu.taskMenuLabel')"
	  />
	</UDropdownMenu>

      </template>
    </div>
  </li>
</template>
