<script setup lang="ts">
import * as v from 'valibot'
import type { FormSubmitEvent } from '@nuxt/ui'

defineI18nRoute({
  paths: {
    en: '/profile',
    de: '/benutzerprofil'
  }
})

definePageMeta({
  middleware: 'auth'
})

const { t } = useI18n()
const localePath = useLocalePath()
const { user } = useUserSession()

const breadcrumbs = [{
  label: t('profile.pageTitle'),
  to: localePath('/profile')
}]

const schema = v.pipe(
  v.object({
    email: v.pipe(v.string(), v.email(t('profile.invalid.email'))),
    new_password: v.pipe(v.string(), v.minLength(10)),
    new_password_repeated: v.string(),
  }),
  v.forward(
    v.partialCheck(
      [['new_password'], ['new_password_repeated']],
      (input) => input.new_password === input.new_password_repeated,
      t('profile.invalid.notMatchingPasswords')
    )
  )
)

const state = reactive({
  username: user.value.username,
  email: user.value.email,
  avatar_url: user.value.avatar_url,
  current_password: '',
  new_password: '',
  new_password_repeated: ''
})

const saveChanges = async () => {
  // TODO: check current password to make sure updates are correct
  console.log('TODO: save changes')
}

</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar>
	<template #leading>
	  <UDashboardSidebarCollapse />
	</template>

	<template #title>
	  <UBreadcrumb :items="breadcrumbs" />
	</template>
	
	<template #right>
	  <UButton
	    :label="t('actions.save')"
	    icon="i-carbon-save"
	    @click="saveChanges"
	  />
	</template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <UPage>
        <UPageBody>
	  <h1>{{ t('profile.pageTitle') }}</h1>
	  <UForm
	    :schema="schema"
	    :state="state"
	    @submit.prevent="saveChanges"
	  >
	    <UFormField
	      :label="t('profile.username')"
	      name="username"
	    >
	      <UInput v-model="state.username"  disabled/>
	    </UFormField>
	    <UFormField
	      :label="t('profile.email')"
	      name="email"
	    >
	      <UInput v-model="state.email" />
	    </UFormField>
	    <UFormField
	      :label="t('profile.avatar')"
	      name="avatar_url"
	    >
	      <UInput v-model="state.avatar_url" disabled />
	    </UFormField>

	    <h2>{{ t('profile.actions.changePassword') }}</h2>
	    <UFormField
	      :label="t('profile.newPassword')"
	      name="new_password"
	    >
	      <UInput v-model="state.new_password" />
	    </UFormField>
	    <UFormField
	      :label="t('profile.newPasswordRepeated')"
	      name="new_password_repeated"
	    >
	      <UInput v-model="state.new_password_repeated" />
	    </UFormField>

	  </UForm>
        </UPageBody>
      </UPage>
    </template>
  </UDashboardPanel>
</template>
