<script setup lang="ts">
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
        <ul>
          <li
            v-for="journal in j.items"
            :key="journal.id"
          >
            <p>{{ journal.title }}</p>
          </li>
        </ul>
      </UDashboardPanelContent>
    </UDashboardPanel>
  </UDashboardPage>
</template>
