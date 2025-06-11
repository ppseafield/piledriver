<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'
import type { Task } from '../../../shared/types/database/tasks'

const { task } = defineProps<{ task: Task }>()
const ts = useTasksStore()
const { t } = useI18n()

const editing = ref<boolean>(false)
const titleText = ref<string>(task.title)

watch(() => task.title, () => {
  // When the task updates its title text, we should update our
  // form title text as well.
  titleText.value = task.title
})

onMounted(() => {
  // If this is a new task, just start editing.
  if (!task.id || task.title === '') {
    editing.value = true
  }
})

/** Completed value for task based on completed_at value. */
const taskCompleted = computed({
  get: () => task.completed_at !== null,
  set: (completed) => ts.setCompleted(task, completed)
})

const taskDropdownItems: DropdownMenuItem[][] = [
  [
    { label: t('dashboard.taskItem.menu.edit'),
      icon: 'i-carbon-edit',
      onSelect: () => editing.value = true
    },
  ],
  [
    { label: t('dashboard.taskItem.menu.delete'),
      icon: 'i-carbon-trash-can'
    }
  ]
]

  // Styles
  const textSize = computed(() => taskTextSize(task?.task_order ?? 7))
const wrapperClass = computed(() => {
  const classes = 'flex flex-column gap-3 p-2 hover:bg-crocodile-200'
  return classes
})
</script>

<template>
  <li :class="wrapperClass">
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
	  @click="editing = true"
	/>
      </UButtonGroup>
    </template>
    <template v-else>
      <div :class="`flex flex-column grow ${textSize}`">
	<span
	  class="ms-4 my-2 grow"
	  @dblclick="editing = true"
	>
	  {{ task.title }}
	</span>
      </div>
      <UDropdownMenu :items="taskDropdownItems">
	<UButton
	  icon="i-carbon-overflow-menu-horizontal"
	  :aria-label="t('dashboard.taskItem.menu.taskMenuLabel')"
	/>
      </UDropdownMenu>
    </template>
  </li>
</template>
