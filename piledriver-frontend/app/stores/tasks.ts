import { defineStoreForResource } from '~/utils/postgrest-resource-store'
import { nowTemporal } from '~~/shared/utils/temporal-helpers'
import type { MoveTaskResponse, Task } from '~~/shared/types/tasks'

interface TaskStore {
  waiting: ComputedRef<Task[]>
  completed: ComputedRef<Task[]>
  updateCompletion: (task: Task) => void
  addTask: (created_by: UUID) => void
  removeTask: (task: Task) => void
  moveTask: (task: Task, move_task_order: number) => Promise<void>
}

const sortTasks = (a: Task, b: Task): number => {
  if (a.task_order === b.task_order) {
    return 0
  } else if (a.task_order && b.task_order) {
    return a.task_order - b.task_order
  } else if (!a.task_order) {
    // sort nulls last
    return 1
  } else {
    return -1
  }
}

export const useTaskStore = defineStoreForResource<Task, TaskStore>('tasks', (rsc) => {
  // TODO: project filters
  const waiting = computed(() => rsc.items.value.filter(t => !t.completed_at))
  const completed = computed(() => rsc.items.value.filter(t => t.completed_at))

  const requestFetch = useRequestFetch()

  const updateCompletion = (task: Task) => {
    console.log('todo: updateCompletion', task)
  }

  const addTask = (created_by: UUID) => {
    rsc.items.value.push({
      created_by,
      journaled_by: null,
      routine_from: null,
      created_at: nowTemporal(),
      completed_at: null,
      archived_at: null,
      title: ''
    })
    triggerRef(rsc.items)
  }

  const removeTask = (task: Task) => {
    if (task.id === undefined) {
      rsc.items.value = rsc.items.value.filter(t => t.id !== undefined)
    } else {
      console.log('todo: remove task', task)
    }
  }

  const moveTask = async (task: Task, move_new_order: number): Promise<void> => {
    if (task.id === undefined) {
      return
    }
    const response = await requestFetch<MoveTaskResponse>('/api/move-task', {
      method: 'POST',
      body: {
        move_task_id: task.id,
        move_new_order
      }
    })
    const updatedOrders: Record<UUID, number> = {}
    for (const { task_id, updated_order } of response) {
      updatedOrders[task_id] = updated_order
    }
    console.log('updatedOrders:', updatedOrders)
    for (const t of rsc.items.value) {
      if (t.id !== undefined && updatedOrders[t.id] !== undefined) {
        console.log('updating task order:', t.id, ' changes ', t.task_order, ' => ', updatedOrders[t.id])
        t.task_order = updatedOrders[t.id]
      }
    }
    rsc.items.value.sort(sortTasks)
    triggerRef(rsc.items)
  }

  return {
    waiting,
    completed,
    updateCompletion,
    addTask,
    removeTask,
    moveTask
  }
})
