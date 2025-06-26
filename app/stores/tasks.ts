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

export const useTasksStore = defineStore('tasks', {
  state: () => ({
    tasks: [] as Task[],
    current: null,
    reorder: {
      open: false,
      task: null as Task | null
    }
  }),
  getters: {
    waiting: ({ tasks }) => tasks.filter(t => t.completed_at === null),
    completed: ({ tasks }) => tasks.filter(t => t.completed_at !== null),
  },
  actions: {
    /** Fetches the dashboard's tasks. */
    async fetch() {
      // Fetch the user's current tasks.
      const requestFetch = useRequestFetch()
      const data = await requestFetch<Task[]>('/api/tasks')
      // Clear any preexisting data.
      this.tasks.splice(0, this.tasks.length, ...data)
    },

    /**
     * Add a new task to the list.
     *
     * @param task - The task to update.
     */
    async addEmptyTask() {
      this.tasks.push({
	id: uuid(),
	completed_at: null,
	task_order: this.waiting.length + 1,
	title: ''
      })
    },

    /**
     * Create or update a task.
     */
    async saveTask(task: Partial<Task>) {
      if (task?.created_at) {
	// Update the task and add those changes to this.tasks.
	const updatedTask = await $fetch('/api/tasks', {
	  method: 'PUT',
	  body: [task]
	})
	if (updatedTask?.[0]) {
	  const index = this.tasks.findIndex(t => t.id === task.id)
	  this.tasks[index] = { ...this.tasks[index], ...updatedTask[0] }
	}
      } else {
	// Create a new task and replace the placeholder.
	const newTask = await $fetch('/api/tasks', {
	  method: 'POST',
	  body: [task]
	})
	if (newTask?.[0]) {
	  Object.assign(this.tasks[this.tasks.length - 1], newTask[0])
	}
      }
    },

    /**
     * Toggles completion of a task and saves it.
     *
     * @param task - The task to update.
     * @param completed - Whether or not the task is completed.
     */
    async setCompleted(task: Task, completed: boolean) {
      console.log(task, completed)
      const updated = {
	...task,
	completed_at: completed ? nowTemporal() : null,
	task_order: completed ? null : this.waiting.length
      }
      // TODO: save task
      // TODO: batch => move task into tasks array
    },

    /**
     * Opens the Reorder Task modal.
     * @param task - The task to reorder.
     */
    openReorderModal(task: Task) {
      this.reorder.task = task
      this.reorder.open = true
    },

    /**
     * closethe Reorder Task modal.
     */
    closeReorderModal() {
      this.reorder.open = false
      this.reorder.task = null
    },

    /**
     * Reorder a task.
     *
     * @param move_task_id - The task to reorder.
     * @param move_new_order - The new order for the task
     */
    async reorderTask(move_task_id: string, move_new_order: number) {
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
      for (const task of this.tasks) {
	if (updates[task.id]) {
	  task.task_order = updates[task.id] as number
	}
      }
      this.tasks.sort(sortTasks)
    }
  }
})
