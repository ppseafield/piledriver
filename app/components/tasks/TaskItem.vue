<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'
import type { Task } from '../../../shared/types/database/tasks'
import SubtaskList from './SubtaskList.vue'

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

const subtaskList = computed(() => sts.mapping?.[task.id] ?? [])

onMounted(() => {
  // If this is a new task, just start editing.
  if (ts.unsavedTaskIDs.has(task.id)) {
    editing.value = true
    liBody.value?.scrollIntoView({ behavior: 'smooth' })
  }
})

/** Completed value for task based on completed_at value. */
const taskCompleted = computed(() => task.completed_at !== null)

// TODO: turn into computed that checks that there are subtasks and
// and some but not all subtasks are completed.
const taskDropdownItems: DropdownMenuItem[][] = [
  [
    { label: t('dashboard.taskItem.menu.edit'),
      icon: 'i-carbon-edit',
      onSelect: () => editing.value = true
    },
    { label: t('dashboard.taskItem.menu.reorder'),
      icon: 'i-carbon-arrows-vertical',
      onSelect: () => ts.openReorderModal(task)
    },
    { label: t('dashboard.taskItem.menu.split'),
      // TODO: Get icon correct!
      // icon: 'i-custom-split-task',
      icon: 'i-carbon-zos-sysplex',
      onSelect: () => console.log('TODO: split')
    }
  ],
  [
    { label: t('dashboard.taskItem.menu.delete'),
      icon: 'i-carbon-trash-can',
      onSelect: () => {
	const taskName = task.completed_at === null
		       ? `#${task.task_order}: '${task.title}'`
		       : `'${task.title}'`
	if (window.confirm( t('dashboard.deleteTaskPrompt', { taskName }) )) {
	  ts.archiveTask(task.id, task.completed_at !== null)
	}
      }
    }
  ]
]

// Styles
const textSize = computed(() => taskTextSize(task?.task_order ?? 7))
const wrapperClass = computed(() => {
  const classes = 'flex flex-column gap-1 lg:gap-3 p-1 lg:p-2 hover:bg-crocodile-200 dark:hover:bg-crocodile-800'
  return classes
})

/**
 * Save the task with the updated title text.
 */
const saveTask = async (event: any) => {
  console.log('keyup event:', event)
  const title = titleText.value.trim()
  if (title.length > 1) {
    await ts.saveTask({ ...task, title })
    editing.value = false

    if (event.shiftKey) {
      ts.addEmptyTask()
    }
  }
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
  >
    <div :class="wrapperClass">
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
	  :autofocus="true"
	  @keyup.enter="saveTask"
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
    </div>
    <SubtaskList
      v-if="subtaskList.length > 0 && task.completed_at === null"
      :task="task"
      :subtaskList="subtaskList"
    />
  </li>
</template>
