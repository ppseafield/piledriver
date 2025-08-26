<script setup lang="ts">
defineI18nRoute({
  paths: {
    en: '/logout',
    de: '/abmelden'
  }
})

definePageMeta({
  layout: 'public'
})

await $fetch('/api/logout')

const { t } = useI18n()
const localePath = useLocalePath()
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-4 p-4">
    <UPageCard class="w-full max-w-md">
      <template #body>
	{{ t('logout.loggedOutMessage') }}
      </template>
      <template #footer>
	<UButton
	  :label="t('logout.loginMessage')"
	  :icon="i-carbon-login"
	  :to="localePath('/login')"
	/>
      </template>
    </UPageCard>
  </div>
</template>
