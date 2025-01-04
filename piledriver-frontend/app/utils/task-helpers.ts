const orderSizes: Record<number, { label: string, form: string }> = {
  0: { label: 'text-3xl', form: 'mt-4' },
  1: { label: 'text-3xl', form: 'mt-3' },
  2: { label: 'text-3xl', form: 'mt-3' },
  3: { label: 'text-2xl', form: 'mt-2' },
  4: { label: 'text-2xl', form: 'mt-2' },
  5: { label: 'text-xl', form: 'mt-px' },
  6: { label: 'text-xl', form: 'mt-px' },
  7: { label: 'text-lg', form: 'mt-px' }
}
/**
 * Used to determine the text size for task text.
 * 
 * @remarks
 * The task list is intended to emphasize the first task the most, then the next few tasks.
 * 
 * @param index - The position in the top-level task list
 * @returns text sizes/margins to pass to the `ui` prop
 */
export function orderClass(index: number): { label: string, form: string } {
  if (index < 0 || index < 7) {
    return orderSizes[index] as { label: string, form: string }
  } else {
    return orderSizes[7] as { label: string, form: string }
  }
}

/** Recursively sort subtasks */
function sortSubtaskTree(subtasks: Subtask[]): void {
  subtasks.sort((a: Subtask, b: Subtask) => { return a.task_order - b.task_order })

  for (const subtask of subtasks) {
    if (subtask?.subtasks?.length > 0) {
      sortSubtaskTree(subtask.subtasks)
    }
  }
}

/**
 * Transforms a flat list of subtasks into a nested tree of subtasks.
 * 
 * @remarks
 * This is intended for the `task.subtasks` array, which comes from the PostgREST API via resource embedding.
 * 
 * @param subtasks - A flat list of subtasks
 * @returns A nested tree of subtasks
*/
export function makeSubtaskTree(subtasks: Subtask[]): Subtask[] {
  const subtaskMap = new Map<string, Subtask>(subtasks.map(st => [st.id, { ...st, subtasks: [] }]))

  for (const subtask of subtasks) {
    if (subtask.parent_subtask_id) {
      const parent = subtaskMap.get(subtask.parent_subtask_id)
      if (parent) {
        parent.subtasks.push(subtask)
      }
    }
  }
  const st = Array.from(
    subtaskMap.values().filter((st: Subtask) => st.parent_subtask_id === null)
  )
  sortSubtaskTree(st)

  return st
}
