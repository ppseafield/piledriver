import { defineStore } from 'pinia'
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'

export const useGlobalStore = defineStore('appGlobal', () => {
  const breakpoints = useBreakpoints(breakpointsTailwind)
  const mobileSized = breakpoints.smaller('lg')

  return {
    mobileSized
  }
})
