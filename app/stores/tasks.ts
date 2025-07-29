import { defineStore } from 'pinia'
import { v7 as uuid } from 'uuid'
import type { Task } from '../../shared/types/database/tasks'

export const useTasksStore = defineStore('tasks', () => {
  const waiting = ref<Task[]>([])
  const completed = ref<Task[]>([])
  const current = ref<Task | null>(null)

  const reorder = reactive({
    open: false,
    task: null as Task | null
  })

  /** Fetches the dashboard's tasks. */
  const fetch = async () => {
    const requestFetch = useRequestFetch()
    const response = await requestFetch<Task[]>('/api/tasks')
    const w = []
    const c = []

    for (const task of response) {
      if (task.completed_at === null) {
	w.push(task)
      } else {
	c.push(task)
      }
    }
    // Replace the existing data with the server's data.
    waiting.value = w
    completed.value = c
  }

  /** Add a new task to the list. */
  const addEmptyTask = async () => {
    const { user } = useUserSession()
    const now = new Date()
    waiting.value.push({
      id: uuid(),
      user_id: (user.value?.id) as string,
      routine_from: null,
      journaled_by: null,
      created_at: now,
      updated_at: now,
      completed_at: null,
      archived_at: null,
      task_order: waiting.value.length + 1,
      title: ''
    })
  }

  /** Save a task (does not consider completion) */
  const saveTask = async(task: Partial<Task>) => {
    if (task?.created_at) {
      // Update the task and add those changes to this.tasks.
      const updatedTask = await $fetch('/api/tasks', {
        method: 'PUT',
	body: [task]
      })
      if (updatedTask?.[0]) {
          const updated = updatedTask[0]
          if (updated.completed_at === null) {
      const i = waiting.value.findIndex(t => t.id === updated.id)
      waiting.value.splice(i, 1, updated)
    } else {
      const i = completed.value.findIndex(t => t.id === updated.id)
      completed.value.splice(i, 1, updated)
    }
        }
      } else {
        // Create a new task and replace the placeholder.
        const newTask = await $fetch<Task[]>('/api/tasks', {
    method: 'POST',
    body: [task]
        })
        if (newTask?.[0]) {
    waiting.value.push(newTask[0])
        }
      }
    }

  /**
   * Completes or uncompletes a task, then updates the completed_at and task_orders.
   *
   * @param task - The task to complete or uncomplete.
   * @param taskCompleted - Whether or not the task is completed.
   */
  const setTaskCompletion = async (task: Task, taskCompleted: boolean) => {
    if (taskCompleted) {
      const response = await $fetch<CompleteTaskResult[]>('/api/complete_task', {
        method: 'POST',
        body: {
          completed_task_id: task.id
        }
      })
      const updates: Record<string, CompleteTaskResult> = Object.fromEntries(
        response.map((ctr) => [ctr.task_id, ctr])
      )
      // Update all of the task_orders/completed_at.
      for (const [i, t] of waiting.value.entries()) {
        if (updates[t.id]) {
          const { updated_order, updated_completed_at } = updates[t.id] as CompleteTaskResult
	  if (waiting.value[i] !== undefined) {
            waiting.value[i].task_order = updated_order
            waiting.value[i].completed_at = updated_completed_at === null ? null : new Date(updated_completed_at)
	  }
        }
      }
      // Find the index of the completed task, remove it from waiting,
      // and add it to completed.
      const wi = waiting.value.findIndex(t => t.id === task.id)
      const [completedTask] = waiting.value.splice(wi, 1) as [Task]
      completed.value.unshift(completedTask)
    } else {
      // Complete and Uncomplete both return [{ task_id, updated_order, updated_completed_at }]
      const uncompleted = await $fetch<CompleteTaskResult>('/api/uncomplete_task', {
        method: 'POST',
        body: {
          task_id: task.id
        }
      })
      const ci = completed.value.findIndex(t => t.id === uncompleted.task_id)
      const [waitingTask] = completed.value.splice(ci, 1) as [Task]
      waiting.value.push({
	...waitingTask,
	...uncompleted
      })
    }
  }

  /**
   * Reorder a task.
   *
   * @param move_task_id - The task to reorder.
   * @param move_new_order - The new order for the task
   */
  const reorderTask = async (move_task_id: string, move_new_order: number) => {
    // Call the endpoint to update the task order, fetching the new task orders.
    const response = await $fetch<ReorderTaskResult[]>('/api/reorder_task', {
      method: 'POST',
      body: {
	move_task_id,
	move_new_order
      }
    })

    // Update the tasks in the store to reflect the new order.
    const updates: Record<string, number> = Object.fromEntries(
      response.map(({ task_id, updated_order }) => [task_id, updated_order])
    )
    for (const task of waiting.value) {
      if (updates[task.id]) {
	task.task_order = updates[task.id] as number
      }
    }
  }

  /**
   * Open the task order modal for reordering without drag & drop.
   *
   * @param task - The task to be reordered.
   */
  const openReorderModal = (task: Task) => {
    reorder.task = task
    reorder.open = true
  }

  return {
    waiting,
    completed,
    current,
    reorder,

    fetch,
    addEmptyTask,
    saveTask,
    setTaskCompletion,
    reorderTask,
    openReorderModal
  }
})
