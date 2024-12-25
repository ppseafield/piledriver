<script setup lang="ts">
import { Container, Draggable } from 'vue3-smooth-dnd'
import TaskItem from './TaskItem.vue'
import { useTaskStore } from '~/stores/tasks'

const ts = useTaskStore()
</script>

<template>
  <Container :tag="{ value: 'ol' }">
    <Draggable
      v-for="(task, index) in ts.items"
      :key="task.id"
      :tag="{ value: 'li' }"
    >
      <TaskItem
        :task="task"
        :index="index"
      />
    </Draggable>
  </Container>
  <UDivider label="Completed" />
  <ul>
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
</template>
