export default defineAppConfig({
  head: {
    title: 'piledriver',
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  ui: {
    colors: {
      primary: 'mariner',
      neutral: 'crocodile'
    },
    input: {
      variants: {
	variant: {
	  outline: 'ring-inset-2'
	}
      }
    }
  },
  uiPro: {
    header: {
      slots: {
	root: 'bg-energy-yellow-300',
	header: 'bg-energy-yellow-300'
      }
    }
  }
})
