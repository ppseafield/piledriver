<script setup lang="ts">
import { useSessionStore } from '../stores/session'
import type { FormSubmitEvent } from '~~/shared/types'
import { loginRequestSchema } from '~~/shared/utils/validation/session'

const session = useSessionStore()

const state = reactive<Partial<LoginRequest>>({
  username: undefined,
  password: undefined
})

async function onSubmit(event: FormSubmitEvent<LoginRequest>) {
  console.log('logging in with:', event.data)

  if (await session.login(event.data)) {
    navigateTo({ path: '/dashboard' })
  } else {
    alert('could not login')
  }
}
</script>

<template>
  <div class="max-w-xl mx-auto">
    <UForm :state="state" :schema="loginRequestSchema" @submit="onSubmit">
      <UFormGroup label="Username" name="username">
        <UInput v-model="state.username" />
      </UFormGroup>

      <UFormGroup label="Password" name="password">
        <UInput v-model="state.password" type="password" />
      </UFormGroup>

      <UButton type="submit">
        Log In
      </UButton>
    </UForm>
  </div>
</template>
