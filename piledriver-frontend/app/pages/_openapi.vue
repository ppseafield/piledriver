<script setup lang="ts">
import type { Request } from 'swagger-ui'
import SwaggerUI from 'swagger-ui'

definePageMeta({
  layout: 'swagger'
})

const bearer = ref<string>('')
watch(bearer, () => {
  localStorage.setItem('bearerToken', bearer.value)
})

const intercept = (a: Request): Request | Promise<Request> => {
  if (bearer.value.length > 0) {
    a.headers['Authorization'] = `Bearer ${bearer.value}`
  }
  return a
}

const setupSwagger = () => {
  SwaggerUI({
    dom_id: '#swagger-ui-root',
    url: 'http://localhost:3030/',
    withCredentials: true,
    requestInterceptor: intercept
  })
}

onMounted(() => {
  const token = localStorage.getItem('bearerToken')
  if (token) {
    bearer.value = token
    setupSwagger()
  }
})

onUnmounted(() => {
  localStorage.removeItem('bearerToken')
})
</script>

<template>
  <DevOnly>
    <div class="container mx-auto mt-6">
      <UFormGroup label="Bearer Token">
        <UInput v-model="bearer" />
      </UFormGroup>
      <UFormGroup>
        <UButton
          color="primary"
          label="Load PostgREST API Explorer"
          @click="setupSwagger"
        />
      </UFormGroup>
    </div>

    <div id="swagger-ui-root" />
    <template #fallback>
      nothing to see here
    </template>
  </DevOnly>
</template>
