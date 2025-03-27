<script setup lang="ts">
import { Container, Draggable } from 'vue3-smooth-dnd'
import TaskItem from './TaskItem.vue'
import { useTaskStore } from '~/stores/tasks'

const ts = useTaskStore()

const getChildPayload = (index: number) => {
  return ts.waiting[index]
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const onDrop = async (e: any) => {
  ts.moveTask(e.payload, e.addedIndex + 1)
}
</script>

<template>
  <div class="min-h-content">
    <Container
      :tag="{ value: 'ol' }"
      group-name="tasks"
      :get-child-payload="getChildPayload"
      class="min-h-fit"
      @drop="onDrop"
    >
      <Draggable
        v-for="(task, index) in ts.waiting"
        :key="task.id"
        :tag="{ value: 'li', class: 'p-1' }"
      >
        <TaskItem
          :task="task"
          :index="index"
        />
      </Draggable>
    </Container>
    <UDivider
      label="Completed"
      class="my-3"
    />
    <ul class="min-h-fit">
      <li
        v-for="(task, index) in ts.completed"
        :key="task.id"
      >
        <TaskItem
          :task="task"
          :index="index"
        />
      </li>
    </ul>
  </div>
</template>
