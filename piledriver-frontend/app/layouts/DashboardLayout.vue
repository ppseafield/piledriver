<script setup lang="ts">
// import { useSessionStore } from '~~/layers/auth/stores/session'

// const session = useSessionStore()
const route = useRoute()
/*
onMounted(async () => {
  try {
    const [restoredUser] = await $fetch<User[]>('/api/restore-session')
    console.log('restored user:', restoredUser)
    session.setUser(restoredUser ?? null)
  } catch (e) {
    console.log('failed to restore', e)
    session.setUser(null)
  }
}) */
const dasbhoardLinks = computed(() => {
  const linkActive = (parentPath: string): boolean => {
    return route.path.indexOf(parentPath) === 0
  }
  return [
    {
      label: 'Dashboard',
      to: '/dashboard',
      active: linkActive('/dashboard'),
      icon: 'i-heroicons-inbox-stack' // 'i-heroicons-computer-desktop', // 'i-heroicons-inbox-stack'
    },
    {
      label: 'Projects',
      to: '/projects',
      active: linkActive('/projects'),
      icon: 'i-heroicons-map' // 'i-heroicons-presentation-chart-line' // ''
    },
    {
      label: 'Goals',
      to: '/goals',
      active: linkActive('/goals'),
      icon: 'i-heroicons-presentation-chart-bar' // 'i-heroicons-presentation-chart-line' // ''
    },
    {
      label: 'Routines',
      to: '/routines',
      active: linkActive('/routines'),
      icon: 'i-heroicons-receipt-refund' // 'i-heroicons-rectangle-stack'
    },
    {
      label: 'Journal',
      to: '/journal',
      active: linkActive('/journal'),
      icon: 'i-heroicons-newspaper' // 'i-heroicons-book-open'
    }
  ]
})

/* const accountItems = [
  [
    { label: 'Profile' },
    { label: 'Settings' }
  ],
  [
    { label: 'Log Out' }
  ]
] */

const footerLinks = [
  { label: 'Home', to: '/' }
]
</script>

<template>
  <UDashboardLayout>
    <UDashboardPanel
      :width="250"
      :resizable="{ min: 200, max: 300 }"
      collapsible
      class="bg-energy-yellow-300"
    >
      <UDashboardNavbar
        class="!border-transparent"
        :ui="{ left: 'flex-1' }"
      >
        <template #left>
          <img src="~/assets/icons/piledriver-bulldozer-32x32.png">
          <span class="font-serif font-semibold text-2xl">piledriver</span>
        </template>
      </UDashboardNavbar>
      <UDashboardSidebar>
        <UDashboardSidebarLinks :links="dasbhoardLinks" />
        <div class="flex-1" />
        <UDashboardSidebarLinks :links="footerLinks" />

        <template #footer>
          user dropdown
        </template>
      </UDashboardSidebar>
    </UDashboardPanel>
    <slot />
  </UDashboardLayout>
</template>
