import { defineStore } from 'pinia'
import { v7 as uuid } from 'uuid'
import type { Task } from '../../shared/types/database/tasks'


/**
 * Sort function for tasks based on task_order.
 *
 * @param t1 - first task to compare
 * @param t2 - second task to compare
 * @returns number - ordering number
 */
function sortTasks(t1: Task, t2: Task): number {
  const { task_order: order1 } = t1
  const { task_order: order2 } = t2

  // Sort the NULLs last.
  if (order1 === order2) {
    return 0
  } else if (order1 === null && order2 !== null) {
    return 1
  } else if (order1 !== null && order2 === null) {
    return -1
  } else {
    // Can't be null because of the above
    return (order1 as number) - (order2 as number)
  }
}

export const new_useTasksStore = defineStore('tasks', () => {
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

  const setTaskCompletion = (task: Task, completed: boolean) => {
    console.log('todo: complete/uncomplete task', task, completed)
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
    // useDrag&Drop takes care of this?
    // this.tasks.sort(sortTasks)
  }

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
