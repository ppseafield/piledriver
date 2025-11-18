<script setup lang="ts">
const { t, locales, setLocale } = useI18n()
definePageMeta({ layout: 'public' })
</script>

<template>
  <div>
    <h1>{{ t('welcome') }}</h1>
    <ul>
      <li v-for="locale in locales" :key="locale.code" @click="setLocale(locale.code)">
	      {{ locale.name }}
      </li>
    </ul>
  </div>
</template>
