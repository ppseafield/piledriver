<script setup lang="ts">
import { en, de } from '@nuxt/ui/locale'
const { t, setLocale } = useI18n()

// TODO: implement other pages
// const navItems = computed(() => [
//   { label: t('layout.aboutLink'), to: '/about' },
//   { label: t('layout.blogLink'), to: '/blog' }
// ])

const locale = ref<'en' | 'de'>('en')
watch(locale, () => {
  console.log('locale changed:', locale.value)
  setLocale(locale.value)
})

</script>

<template>
  <UHeader>
    <template #left>
      <NuxtLink to="/">
        {{ t('layout.siteTitle')}}
      </NuxtLink>
    </template>

<!--    <UNavigationMenu-->
<!--        :items="navItems"-->
<!--        variant="link"-->
<!--        class="hidden lg:block"-->
<!--    />-->


    <template #right>
      <ULocaleSelect
          v-model="locale"
          :locales="[en, de]"
          class="hidden lg:block"
      />
    </template>

    <template #body>
<!--      <UNavigationMenu-->
<!--          :items="navItems"-->
<!--          variant="link"-->
<!--          orientation="vertical"-->
<!--          class=""-->
<!--      />-->
      <ULocaleSelect
        v-model="locale"
	color="primary"
        :locales="[en, de]"
      />
    </template>
  </UHeader>
</template>
