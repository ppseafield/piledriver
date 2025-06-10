/**
 * A mapping of indexes to :ui props for task text.
 */
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

const orderClasses: Record<number, string> = {
  0: 'text-4xl',
  1: 'text-3xl',
  2: 'text-3xl',
  3: 'text-2xl',
  4: 'text-2xl',
  5: 'text-xl',
  6: 'text-xl',
  7: 'text-lg'
}

/**
 * Gives a text size class for a task based on its order.
 *
 * @param task_order - Ordering in task dashboard.
 * @returns Text size and checkbox margin for a task's title.
 */
export function taskTextSize(task_order: number) {
  return orderClasses[ Math.min(task_order, 7) ]
}

