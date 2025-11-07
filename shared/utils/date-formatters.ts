
// TODO: insane idea longer translation mapping between e.g.
// en: '{year: 2 digit}'
// de: '{Jahre: dreistellig}'
export const formatters = {
  'y': new Intl.DateTimeFormat(undefined, {
    year: '2-digit'
  }),
  'Y': new Intl.DateTimeFormat(undefined, {
    year: 'numeric'
  }),
  'm': new Intl.DateTimeFormat(undefined, {
    month: 'numeric'
  }),
  'M': new Intl.DateTimeFormat(undefined, {
    month: 'long'
  }),
  'd': new Intl.DateTimeFormat(undefined, {
    day: 'numeric'
  }),
  'wd': new Intl.DateTimeFormat(undefined, {
    weekday: 'short'
  }),
  'WD': new Intl.DateTimeFormat(undefined, {
    weekday: 'long'
  })
}
