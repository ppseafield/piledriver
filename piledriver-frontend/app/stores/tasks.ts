import { defineStoreForResource } from '~/utils/postgrest-resource-store'
import { nowTemporal } from '~~/shared/utils/temporal-helpers'
import type { MoveTaskResponse, Task } from '~~/shared/types/tasks'
import { makeSubtaskTree } from '~/utils/task-helpers'
import { useSessionStore } from '~~/layers/auth/stores/session'

interface TaskStore {
  waiting: ComputedRef<Task[]>
  completed: ComputedRef<Task[]>
  updateCompletion: (task: Task, completed: boolean) => void
  addBlankTask: () => void
  removeTask: (task: Task) => void
  moveTask: (task: Task, move_task_order: number) => Promise<void>
  nextOrder: ComputedRef<number>
  splitCompleted: (task: Task) => void
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

const prepareTasks = (tasks: Task[]): Task[] => {
  // omit subtasks, since they are not part of the task table
  const prepared = tasks.map(({ subtasks, ...t }) => t)
  console.log('prepared tasks:', prepared)
  return prepared
}

const mapResponseTasks = (tasks: Task[]): Task[] => {
  // Turn a flat subtask list into a tree of subtasks
  return tasks.map(t => ({ ...t, subtasks: makeSubtaskTree(t.subtasks ?? []) }))
}

export const useTaskStore = defineStoreForResource<Task, TaskStore>(
  'tasks',
  (rsc) => {
    const session = useSessionStore()
    // TODO: project filters
    const waiting = computed(() => rsc.items.value.filter(t => t.completed_at === null))
    const completed = computed(() => rsc.items.value.filter(t => t.completed_at))

    const nextOrder = computed(() => Math.max(...rsc.items.value.map(t => t.task_order ?? 0)) + 1)

    const requestFetch = useRequestFetch()

    const updateCompletion = (task: Task, completed: boolean) => {
      if (task.id === undefined) {
        return
      } else {
        rsc.put([{
          ...task,
          completed_at: completed ? nowTemporal() : null,
          task_order: completed ? null : nextOrder.value
        }])
      }
    }

    const addBlankTask = () => {
      rsc.items.value.push({
        created_by: session.user?.user_id as UUID,
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
    const splitCompleted = (task: Task) => {
      console.log('TODO - splitting task:', task)
    }

    return {
      waiting,
      completed,
      updateCompletion,
      addBlankTask,
      removeTask,
      moveTask,
      nextOrder,
      splitCompleted
    }
  },
  {
    sortItems: sortTasks,
    prepare: prepareTasks,
    mapResponse: mapResponseTasks
  }
)
