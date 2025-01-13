<script setup lang="ts">
definePageMeta({
  layout: 'dashboard-layout'
})

const j = useJournalStore()
const route = useRoute()
await j.ensureCurrent(route.params.journalId)
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar
        :ui="{ left: 'grow min-w-full' }"
        :title="'title'"
      />

      <UDashboardToolbar>
        <template #left>
          Published <span>date</span>
        </template>

        <template #right>
          <UButton
            color="primary"
            label="Edit"
            icon="i-heroicons-check"
            @click="() => console.log('edit')"
          />
        </template>
      </UDashboardToolbar>

      <UDashboardPanelContent>
        <div class="flex gap-4 h-full">
          <section
            v-html="j.currentItem?.text_body"
            class="w-2/3 h-full tiptap-container" 
          />
          <UAside
            :ui="{ wrapper: 'w-1/3' }"
          >
            <template #top>
              <h3>Completed Tasks</h3>
            </template>

            <ul>
              <li
                v-for="task in j.currentItem?.tasks"
                :key="task.id"
              >
                <UCheckbox
                  :model-value="true"
                  :label="task.title"
                  :disabled="true"
                />
              </li>
            </ul>
          </UAside>
        </div>
      </UDashboardPanelContent>
    </UDashboardPanel>
  </UDashboardPage>
</template>
