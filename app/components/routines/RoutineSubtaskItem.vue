<script setup lang="ts">
const { subtask } = defineProps<{ subtask: RoutineSubtask }>()
const rs = useRoutineStore()
const { t } = useI18n()

/**********
 * Note to self:
 * Why is this different?
 *
 * Eventually this will have a ton of tracking/measurement metrics assigned to it.
 * 
 * RoutineSubtaskItem will have a complicated form builder that produces something like
 *   [
 *      { name: 'Time Reading', fieldType: 'duration', defaultUnit: 'minutes' },
 *      { name: 'Pages Read', fieldType: 'integer', defaultUnit: 'custom', customUnit: 'Pages' }
 *   ]
 *
 * TaskItem and SubtaskItem will have actually recorded values that will take, e.g.
 *   Task: Evening Routine
 *     Subtask: Read a Book
 *       Recorded values: [
 *         { recordTypeId: <Time Reading>, value: 75 },
 *         { recordTypeId: <Pages Read>, value: 35 }
 *       ]
 */

const editing = ref<boolean>(false)
const titleText = ref<string>(subtask.title)
const rsBody = useTemplateRef<HTMLLIElement>('rs-body')

watch(() => subtask, () => {
  // When the subtask updates its title text, we should update our
  // form title text as well.
  if (subtask.title) {
    titleText.value = subtask.title
  }
})
onMounted(() => {
  //If this is a new task, just start editing.
  // if (rs.unsavedSubtaskIDs.has(subtask.id)) {
  //   editing.value = true
  //   rsBody.value?.scrollIntoView({ behavior: 'smooth' })
  // }
})

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
	  rs.archiveSubtask(subtask.id)
	}
      }
    }
  ]
]


const saveSubtask = async () => {
  console.log('todo: save subtask')
}
</script>
<template>
  <li
    ref="rs-body"
    :data-routine-subtask-id="subtask.id"
  >
    <div class="flex flex-column gap-1 lg:gap-3 p-1 lg:p-2 hover:bg-crocodile-200 dark:hover:bg-crocodile-800">
      <span>
	{{ subtask.task_order }}
      </span>

      <template v-if="editing">
	<UInput
	  v-model="titleText"
	  class="grow"
	  :autofocus="true"
	  @keyup.enter="saveSubtask"
	/>
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
	    color="info"
	    icon="i-carbon-overflow-menu-horizontal"
	    :aria-label="t('dashboard.taskItem.menu.taskMenuLabel')"
	  />
	</UDropdownMenu>
      </template>
    </div>
  </li>
</template>
