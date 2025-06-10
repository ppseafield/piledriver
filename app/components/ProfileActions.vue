<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'
const { t } = useI18n()
const { loggedIn, user } = useUserSession()

const profileTag = computed(() => {
  if (loggedIn && user.value?.username) {
    return user.value.username
  } else {
    return t('layout.accountNotLoggedInTitle')
  }
})

const accountActions = computed<DropdownMenuItem[][]>(() => {
  if (loggedIn) {
    return [
      [
	{ label: t('layout.profile.profileLink'),
	  icon: 'i-carbon-user-avatar-filled-alt'
	}
      ]
    ]
  } else {
    return []
  }
})
</script>
<template>
  <div class="w-full flex justify-between">
    <span>{{ profileTag }}</span>
    <UDropdownMenu
      :items="accountActions"
    >
      <UButton
	icon="i-carbon-user-avatar-filled-alt"
	:aria-label="t('layout.profile.accountActionsLabel')"
      />
    </UDropdownMenu>
  </div>
</template>
