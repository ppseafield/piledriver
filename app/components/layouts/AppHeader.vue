<script setup lang="ts">
import { en, de } from '@nuxt/ui/locale'
import logo from '/assets/images/piledriver-bulldozer-32.png'

const { loggedIn } = useUserSession()
const { t, setLocale } = useI18n()
const localePath = useLocalePath()
const route = useRoute()

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

const showLogin = computed(() => route.path !== localePath('/login'))
</script>

<template>
  <UHeader>
    <template #left>
      <img
	:src="logo"
	:alt="t('layout.piledriverLogoText')"
      />

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
      <UColorModeButton />
      <ULocaleSelect
          v-model="locale"
          :locales="[en, de]"
          class="hidden lg:block"
      />

      <UButton
	v-if="loggedIn"
	:label="t('dashboard.pageTitle')"
	icon="i-carbon-image-store-local"
	:to="localePath('/dashboard')"
      />	
      <UButton
	v-else-if="showLogin"
	:label="t('login.pageTitle')"
	icon="i-carbon-login"
	:to="localePath('/login')"
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
