/**
 * A mapping of indexes to :ui props for task text.
 */
const orderSizes: Record<number, { label: string, form: string }> = {
  0: { label: 'text-xl lg:text-3xl', form: 'mt-4' },
  1: { label: 'text-xl lg:text-3xl', form: 'mt-3' },
  2: { label: 'text-xl lg:text-3xl', form: 'mt-3' },
  3: { label: 'text-lg lg:text-2xl', form: 'mt-2' },
  4: { label: 'text-lg lg:text-2xl', form: 'mt-2' },
  5: { label: 'text-md lg:text-xl', form: 'mt-px' },
  6: { label: 'text-md lg:text-xl', form: 'mt-px' },
  7: { label: 'text-md lg:text-lg', form: 'mt-px' }
}

const orderClasses: Record<number, string> = {
  0: 'text-xl lg:text-4xl',
  1: 'text-xl lg:text-3xl',
  2: 'text-lg lg:text-3xl',
  3: 'text-lg lg:text-2xl',
  4: 'text-lg lg:text-2xl',
  5: 'text-md lg:text-xl',
  6: 'text-md lg:text-xl',
  7: 'text-md lg:text-lg'
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

