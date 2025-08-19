<script setup lang="ts">
const { task, subtask } = defineProps<{ task: Task, subtask: Subtask }>()

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
    titleText.value = task.title
  }
})
onMounted(() => {
  // If this is a new task, just start editing.
  // if (sts.unsavedSubtaskIDs.has(subtask.id)) {
  //   editing.value = true
  //   liBody.value?.scrollIntoView({ behavior: 'smooth' })
  // }
})

const subtaskCompleted = computed(() => subtask.completed_at !== null)

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
	  // TODO: sts.archiveSubtask(subtask.id, subtask.completed_at !== null)
	  console.log('archive subtask')
	}
      }
    }
  ]
]

const updateSubtaskCompletion = (completed: boolean | "indeterminate") => {
  // TODO: update subtask completion
  console.log('update subtask completion:', completed)
}

const saveSubtask = () => {
  // TODO: Save subtask
  console.log('save subtask')
}

</script>

<template>
  <li
    ref="li-body"
  >
    <div class="flex flex-column gap-1 lg:gap-3 p-1 lg:p-2 hover:bg-crocodile-200 dark:hover:bg-crocodile-800">
      <UCheckbox
	size="lg"
	icon="i-carbon-checkmark"
	:label="subtask?.task_order?.toString()"
	:disabled="editing"
	@update:modelValue="updateSubtaskCompletion"
      />
      <template v-if="editing">
	<UInput
	  v-model="titleText"
	  class="grow"
	  keyup.enter="saveSubtask"
	  :autofocus="true"
	/>
	<UButtonGroup>
	  <UButton
	    icon="i-carbon-close"
	    :aria-label="t('dashboard.taskItem.menu.delete')"
	    @click="editing = false; titleText = task.title"
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
	    icon="i-carbon-overflow-menu-horizontal"
	    :aria-label="t('dashboard.taskItem.menu.taskMenuLabel')"
	  />
	</UDropdownMenu>

      </template>
    </div>
  </li>
</template>
