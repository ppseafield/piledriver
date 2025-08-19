<script setup lang="ts">
const { task, subtask } = defineProps<{ task: Task, subtask: Subtask }>()

const editing = ref<boolean>(false)
const titleText = ref<string>(subtask.title)
const liBody = useTemplateRef<HTMLLIElement>('li-body')

</script>

<template>
  <li>
    {{ subtask.title }}
  </li>
</template>
