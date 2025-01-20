<script setup lang="ts">
import type { MiddlewareKey } from '#build/types/middleware'
import { useProjectStore } from '~/stores/projects'

definePageMeta({
  layout: 'dashboard-layout',
  middleware: ['require-auth' as MiddlewareKey]
})

const p = useProjectStore()
await p.get()
</script>

<template>
  <div>
    <p>projects?!</p>
  </div>
</template>
