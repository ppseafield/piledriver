<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'
import type { Task } from '../../../shared/types/database/tasks'

const props = defineProps<{ task: Ref<Task> }>()
const { task } = toRefs(props)
const ts = useTasksStore()
const { t } = useI18n()

const editing = ref<boolean>(false)
const titleText = ref<string>(task.value.title)
const liBody = useTemplateRef<HTMLLIElement>('li-body')

watch(() => task, () => {
  // When the task updates its title text, we should update our
  // form title text as well.
  titleText.value = task.value.title
})

onMounted(() => {
  // If this is a new task, just start editing.
  if (!task.value.id || task.value.title === '') {
    editing.value = true
    liBody.value?.scrollIntoView({ behavior: 'smooth' })
  }
})

/** Completed value for task based on completed_at value. */
const taskCompleted = computed({
  get: () => task.value.completed_at !== null,
  set: (completed) => ts.setCompleted(task.value, completed)
})

const taskDropdownItems: DropdownMenuItem[][] = [
  [
    { label: t('dashboard.taskItem.menu.edit'),
      icon: 'i-carbon-edit',
      onSelect: () => editing.value = true
    },
    { label: t('dashboard.taskItem.menu.reorder'),
      icon: 'i-carbon-arrows-vertical',
      onSelect: () => ts.openReorderModal(task.value)
    }
  ],
  [
    { label: t('dashboard.taskItem.menu.delete'),
      icon: 'i-carbon-trash-can'
    }
  ]
]

// Styles
const textSize = computed(() => taskTextSize(task.value?.task_order ?? 7))
const wrapperClass = computed(() => {
  const classes = 'flex flex-column gap-3 p-2 hover:bg-crocodile-200'
  return classes
})

/**
 * Save the task with the updated title text.
 */
const saveTask = async () => {
  // TODO: validate title text
  await ts.saveTask({
    ...task.value,
    title: titleText.value
  })
  editing.value = false
}
</script>

<template>
  <li
    ref="li-body"
    :data-task-id="task.id"
    :class="wrapperClass"
  >
    <UCheckbox
      :v-model="taskCompleted"
      :ui="{ label: textSize }"
      size="lg"
      icon="i-carbon-checkmark"
      :label="task?.task_order?.toString()"
      :disabled="editing"
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
	  class="ms-4 my-2 grow"
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
