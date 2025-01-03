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
export function orderClass(index: number): { label: string, form: string } {
  if (index < 0 || index < 7) {
    return orderSizes[index] as { label: string, form: string }
  } else {
    return orderSizes[7] as { label: string, form: string }
  }
}

export function makeSubtaskTree(subtasks: Subtask[]): Subtask[] {
  const subtaskMap = new Map<string, Subtask>(subtasks.map(st => [st.id, st]))

  for (const subtask of subtasks) {
    if (subtask.parent_subtask_id) {
      const parent = subtaskMap.get(subtask.parent_subtask_id)
      if (parent) {
        if (!parent.subtasks) {
          parent.subtasks = []
        }
        parent.subtasks.push(subtask)
      }
    }
  }
  return Array.from(
    subtaskMap.values().filter((st: Subtask) => st.parent_subtask_id === null)
  )
}
