<script setup lang="ts">
const route = useRoute()

const { user } = useUserSession()

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

const accountItems = [
  [
    {
      label: 'Profile',
      to: '/profile',
      icon: 'i-heroicons-user'
    },
    {
      label: 'Settings',
      to: '/profile/settings',
      icon: 'i-heroicons-cog'
    }
  ],
  [
    {
      label: 'Log Out',
      to: '/logout',
      icon: 'i-heroicons-arrow-right-start-on-rectangle'
    }
  ]
]

const footerLinks = [
  { label: 'Home', to: '/' }
]
</script>

<template>
  <UDashboardLayout>
    <UDashboardPanel
      :width="190"
      :resizable="{ min: 190, max: 260 }"
      collapsible
      class="bg-energy-yellow-300"
    >
      <UDashboardNavbar
        class="!border-transparent"
        :ui="{ left: 'flex-1' }"
      >
        <template #left>
          <img
            src="~/assets/icons/piledriver-bulldozer-32x32.png"
            alt="piledriver logo (yellow bulldozer)"
          >
          <span class="font-serif font-semibold text-2xl">piledriver</span>
        </template>
      </UDashboardNavbar>
      <UDashboardSidebar>
        <UDashboardSidebarLinks :links="dasbhoardLinks" />
        <div class="flex-1" />
        <UDashboardSidebarLinks :links="footerLinks" />

        <template #footer>
          <UDropdown
            :items="accountItems"
            class="w-full grow"
          >
            <UButton
              color="tango"
              trailing-icon="i-heroicons-chevron-up-20-solid"
              :label="user?.username || 'Account'"
              :ui="{ wrapper: 'w-full grow', block: 'grow', inline: 'justify-between grow' }"
            />
          </UDropdown>
        </template>
      </UDashboardSidebar>
    </UDashboardPanel>
    <slot />
  </UDashboardLayout>
</template>
