// import { vi } from 'vitest'
// import { mockNuxtImport } from '@nuxt/test-utils/runtime'

export const setup = () => {
  process.env.TZ = 'America/Los_Angeles'
  process.env.LC_ALL = 'en-us.UTF-8'

  // TODO: get nuxt i18n working with mountSuspended from @nuxt/test-utils.
  // mockNuxtImport("useI18n", async () => {
  //   const actualNuxtAppImports =
  //     await vi.importActual<typeof import("#app")>("#app");

  //   return () => {
  //     return actualNuxtAppImports.useNuxtApp().$i18n;
  //   };
  // });
}
