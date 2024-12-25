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
