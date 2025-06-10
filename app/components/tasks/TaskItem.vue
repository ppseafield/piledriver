<script setup lang="ts">
import type { Task } from '../../../shared/types/database/tasks'

const { task } = defineProps<{ task: Task }>()
const ts = useTasksStore()

const editing = ref<boolean>(false)
const titleText = ref<string>(task.title)

watch(() => task.title, () => {
  // When the task updates its title text, we should update our
  // form title text as well.
  titleText.value = task.title
})

onMounted(() => {
  // If this is a new task, just start editing
  if (!task.id || task.title === '') {
    editing.value = true
  }
})

/** Completed value for task based on completed_at value. */
const taskCompleted = computed({
  get: () => task.completed_at !== null,
  set: (completed) => ts.setCompleted(task, completed)
})

const textSize = computed(() => taskTextSize(task.task_order))
</script>

<template>
  <li class="flex flex-column">
    <UCheckbox
      :v-model="taskCompleted"
      :ui="{ label: textSize }"
      size="lg"
      icon="i-carbon-checkmark"
      :label="task.task_order.toString()"
      :disabled="editing"
    />

    <template v-if="editing">
      <UInput
	v-model="titleText"
	:ui="{ base: textSize }"
      />

    </template>
    <template v-else>
      <div :class="`flex flex-column grow ${textSize}`">
	<span
	  class="ms-4"
	  @dblclick="editing = true"
	>
	  {{ task.title }}
	</span>
      </div>
    </template>
  </li>
</template>
