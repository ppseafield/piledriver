export default defineAppConfig({
  head: {
    title: 'piledriver',
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  ui: {
    colors: {
      primary: 'bamboo',
      secondary: 'energy-yellow',
      neutral: 'crocodile'
    },
    input: {
      variants: {
	variant: {
	  outline: 'ring-inset-2'
	}
      }
    },
    navigationMenu: {
      slots: {
	link: 'data-[active]:font-bold'
      }
    }
  },
  uiPro: {
    header: {
      slots: {
	root: 'bg-energy-yellow-300 dark:bg-crocodile-900',
	header: 'bg-crocodile-900 dark:bg-crocodile-900'
      }
    },
    dashboardSidebar: {
      // man, dark yellow is crappy brown. need another color
      slots: {
	root: 'bg-energy-yellow-300 dark:bg-crocodile-900',
	header: 'bg-energy-yellow-300 dark:bg-crocodile-900 app-title text-bold text-xl content-center'
      }
    },
    dashboardPanel: {
      slots: {
	root: 'bg-zinc-50 dark:bg-crocodile-950'
      }
    }
  }
})
