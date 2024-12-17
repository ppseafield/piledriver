<template>
  <UHeader class="bg-energy-yellow-300">
    <template #logo>
      <span>piledriver</span>
    </template>
  </UHeader>

  <UMain class="max-w-4xl mx-auto my-8">
    <slot />
  </UMain>

  <UModals />

  <UFooter>
    <template #left>
      Copyright © {{ new Date().getFullYear() }}
    </template>
  </UFooter>
</template>
