<script setup lang="ts">
import { Container, Draggable } from 'vue3-smooth-dnd'
import SubtaskItem from './SubtaskItem.vue'

const props = defineProps<{
  task: Task
  level: number
}>()

const st = useSubtaskStore()
const subtasks = st.getSubtasks(props.task.id)

const getChildPayload = (index: number) => {
  return subtasks[index]
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const onDrop = async (e: any) => {
  console.log('todo: move subtask', e)
}

const containerProps = {
  class: 'ps-6 before:absolute before:top-0 before:start-4 before:w-0.5 before:-ms-px before:h-full before:bg-crocodile-300 dark:before:bg-neutral-700'
}
</script>

<template>
  <div>
    <Container
      :tag="{
        value: 'ol',
        props: containerProps
      }"
      group-name="subtasks"
      :get-child-payload="getChildPayload"
      @drop="onDrop"
    >
      <Draggable
        v-for="subtask in subtasks"
        :key="subtask.id"
        :tag="{ value: 'li' }"
      >
        <SubtaskItem
          :subtask="subtask"
          :task="task"
          :level="level"
        />
      </Draggable>
    </Container>
  </div>
</template>
