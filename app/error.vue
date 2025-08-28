<script setup lang="ts">
import type { NuxtError } from '#app'

const localePath = useLocalePath()
const { error } = defineProps({
  error: Object as () => NuxtError
})

console.log('error:', error)

// Unauthorized -> log (back) in and return.
if (error?.statusCode === 401) {
  navigateTo(localePath({ path: '/login', params: { returnTo: error.url } }))
}

const handleError = () => clearError({ redirect: '/' })
</script>

<template>
  <div>
    <h2>{{ error?.statusCode }}</h2>
    <button @click="handleError">Clear errors</button>
  </div>
</template>
