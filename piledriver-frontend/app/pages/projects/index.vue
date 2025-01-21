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
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar title="Projects" />

      <UDashboardToolbar>
        <template #right>
          <UButton
            color="primary"
            label="Add New Project"
            @click="navigateTo('/projects/new')"
          />
        </template>
      </UDashboardToolbar>

      <UDashboardPanelContent>
        <UBlogList orientation="vertical">
          <UBlogPost
            v-for="entry in p.items"
            :key="entry.id"
            :title="entry.title"
            :date="shortDate(entry.created_at)"
            :to="`/projects/${entry.id}`"
          />
        </UBlogList>
      </UDashboardPanelContent>
    </UDashboardPanel>
  </UDashboardPage>
</template>
