<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'
import type { Task } from '../../../shared/types/database/tasks'

const { task } = defineProps<{ task: Task }>()

const ts = useTasksStore()
const sts = useSubtasksStore()
const { t } = useI18n()

const editing = ref<boolean>(false)
const titleText = ref<string>(task.title)
const liBody = useTemplateRef<HTMLLIElement>('li-body')

watch(() => task, () => {
  // When the task updates its title text, we should update our
  // form title text as well.
  if (task.title) {
    titleText.value = task.title
  }
})

const subtaskList = computed(() => {
  return sts.mapping?.[task.id] ?? []
})

onMounted(() => {
  // If this is a new task, just start editing.
  if (!task.id || task.title === '') {
    editing.value = true
    liBody.value?.scrollIntoView({ behavior: 'smooth' })
  }
})

/** Completed value for task based on completed_at value. */
const taskCompleted = computed(() => task.completed_at !== null)

const taskDropdownItems: DropdownMenuItem[][] = [
  [
    { label: t('dashboard.taskItem.menu.edit'),
      icon: 'i-carbon-edit',
      onSelect: () => editing.value = true
    },
    { label: t('dashboard.taskItem.menu.reorder'),
      icon: 'i-carbon-arrows-vertical',
      onSelect: () => ts.openReorderModal(task)
    }
  ],
  [
    { label: t('dashboard.taskItem.menu.delete'),
      icon: 'i-carbon-trash-can',
      onSelect: () => {
	const taskName = task.completed_at === null
		       ? `#${task.task_order}: '${task.title}'`
		       : `'${task.title}'`
	if (window.confirm( t('dashboard.deleteItemPrompt', { taskName }) )) {
	  ts.archiveTask(task.id, task.completed_at !== null)
	}
      }
    }
  ]
]

// Styles
const textSize = computed(() => taskTextSize(task?.task_order ?? 7))
const wrapperClass = computed(() => {
  const classes = 'flex flex-column gap-1 lg:gap-3 p-1 lg:p-2 hover:bg-crocodile-200'
	  return classes
	})

	  /**
	   * Save the task with the updated title text.
	   */
	  const saveTask = async () => {
  // TODO: validate title text
  await ts.saveTask({
    ...task,
    title: titleText.value
  })
  editing.value = false
}

const updateTaskCompletion = (completed: boolean | "indeterminate") => {
  if (completed !== "indeterminate") {
    ts.setTaskCompletion(task, completed)
  }
}
</script>

<template>
  <li
    ref="li-body"
    :data-task-id="task.id"
    :class="wrapperClass"
  >
    <UCheckbox
      :modelValue="taskCompleted"
      :ui="{ label: textSize }"
      size="lg"
      icon="i-carbon-checkmark"
      :label="task?.task_order?.toString()"
      :disabled="editing"
      @update:modelValue="updateTaskCompletion"
    />

    <template v-if="editing">
      <UInput
	v-model="titleText"
	:ui="{ base: textSize }"
	class="grow"
	@keyup.enter="saveTask"
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
	  @click="saveTask"
	/>
      </UButtonGroup>
    </template>
    <template v-else>
      <div :class="`flex flex-column grow ${textSize}`">
	<span
	  class="mx-1 lg:mx-2 grow"
	  @dblclick="editing = true"
	>
	  {{ titleText }}
	</span>
      </div>
      <UDropdownMenu
	:items="taskDropdownItems"
	class="h-9"
      >
	<UButton
	  icon="i-carbon-overflow-menu-horizontal"
	  :aria-label="t('dashboard.taskItem.menu.taskMenuLabel')"
	/>
      </UDropdownMenu>
    </template>
  </li>
</template>
