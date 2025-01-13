<script setup lang="ts">
import { shortDate } from '~~/shared/utils/temporal-helpers'

definePageMeta({
  layout: 'dashboard-layout'
})

const j = useJournalStore()

await j.get()
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar title="Journal" />

      <UDashboardToolbar>
        <template #right>
          <UButton
            color="primary"
            label="Add New Journal Entry"
            @click="navigateTo('/journal/new')"
          />
        </template>
      </UDashboardToolbar>

      <UDashboardPanelContent>
        <UBlogList orientation="vertical">
          <UBlogPost
            v-for="entry in j.items"
            :key="entry.id"
            :title="entry.title"
            :date="shortDate(entry.created_at)"
            :to="`/journal/${entry.id}`"
          />
        </UBlogList>
      </UDashboardPanelContent>
    </UDashboardPanel>
  </UDashboardPage>
</template>
