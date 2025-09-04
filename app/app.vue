<script setup lang="ts">
import { useDocumentVisibility } from '@vueuse/core'
import * as locales from '@nuxt/ui-pro/locale'

const { locale } = useI18n()

const visibility = useDocumentVisibility()
let timeout = null

// TODO: do this transparently via middleware or some such
// Regularly refre
const refreshSession = () => console.log("would do: fetch('/api/refresh_session')")

watch(() => visibility, (visible) => {
  if (visible) {
    refreshSession()
    timeout = window.setInterval(refreshSession, 600000) // call every ten minutes
  } else if (timeout !== null) {
    window.clearInterval(timeout)
  }
})

</script>

<template>
  <UApp :locale="locales[locale]">
    <NuxtLoadingIndicator
      color="repeating-linear-gradient(to right,#95350b 0%,#dd6802 50%,#ffb120 100%)"
    />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
