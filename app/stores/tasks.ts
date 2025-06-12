import { defineStore } from 'pinia'
import { v7 as uuid } from 'uuid'
import type { Task } from '../../shared/types/database/tasks'

export const useTasksStore = defineStore('tasks', {
  state: () => ({
    tasks: [] as Task[],
    current: null
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
	// update
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
    }
  }
})
