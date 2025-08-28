<script setup lang="ts">
import type { FormSubmitEvent, FormError } from '@nuxt/ui'
import { safeParse } from 'valibot'

defineI18nRoute({
  paths: {
    en: '/login',
    de: '/anmelden'
  }
})

definePageMeta({
  layout: 'public'
})

// TODO: Why does the login button not have any color?

const { t } = useI18n()
const localePath = useLocalePath()
const session = useUserSession()

const state = reactive<Partial<LoginRequest>>({
  username: undefined,
  password: undefined
})

function validate(state: any): FormError[] {
  const result = safeParse(LoginRequestSchema, {
    username: state.username ?? '',
    password: state.password ?? '',
  })
  if (result.issues === undefined || result.issues.length === 0) {
    return []
  } else {
    const issues = result.issues.map(issue => ({
      name: issue.path?.[0].key ?? 'field',
      message: t(issue.message)
    } as FormError))
    return issues
  }
}

async function onSubmit(payload: FormSubmitEvent<LoginRequest>) {
  const localePath = useLocalePath()
  try {
    await $fetch<{ user: User | null, session: any }>('/api/login', {
      method: 'POST',
      headers: {
	'Content-Type': 'application/json'
      },
      body: payload.data
    })
    await session.fetch()
    navigateTo({ path: localePath('dashboard') })
  } catch (e) {
    // formwide error: error issue
    console.log('error: ', e)
  }
}
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-4 p-4">
    <UPageCard class="w-full max-w-md">
      <UForm
	:validate="validate"
	:state="state"
	icon="i-carbon-user-avatar-filled-alt"
	class="w-full flex flex-col justify-center align-center gap-4"
	@submit.prevent="onSubmit"
      >
	<div class="w-full flex justify-center">
	  <UAvatar icon="i-carbon-user-avatar-filled-alt" size="3xl" />
	</div>

	<h1 class="w-full text-center">{{ t('login.pageTitle') }}</h1>

	<UFormField :label="t('login.username')" name="username">
	  <UInput
	    v-model="state.username"
	    class="w-full"
	    variant="outline"
	  />
	</UFormField>

	<UFormField :label="t('login.password')" name="password">
	  <UInput
	    v-model="state.password"
	    type="password"
	    variant="outline"
	    class="w-full"
	  />
	</UFormField>

	<UButton
	  type="submit"
	  variant="outline"
	  color="primary"
	  class="mt-2"
	  :label="t('login.submitButton')"
	/>
      </UForm>
    </UPageCard>
  </div>
</template>
