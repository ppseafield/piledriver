import { defineStore } from 'pinia'
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
      // TODO: implement
      console.log('add new task')
    },

    /**
     * Updates an existing task.
     *
     * @param task - The task to update.
     */
    async updateTask(task: Task) {
      // TODO: implement
      console.log('update task:', task)
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
