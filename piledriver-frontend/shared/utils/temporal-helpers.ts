import { Temporal } from 'temporal-polyfill'

/* declare global {
  interface Window {
    Temporal: typeof Temporal
  }
}

window.Temporal = Temporal */

export function nowTemporal(): string {
  return Temporal.Now.zonedDateTimeISO().toString({ timeZoneName: 'never' })
}

export function twoWeeksAgo(): string {
  return Temporal.Now.plainDateISO().subtract({ days: 14 }).toString()
}

/**
 * Takes a postgres timestamp with timezone and returns a nice, localized formatted date
 * @param datestring - timestamp with timezone from postgres
 * @returns string - nice formatted date
 */
export function shortDate(datestring: string): string {
  return Temporal.Instant.from(datestring).toLocaleString(undefined, {
    month: 'short', day: 'numeric', year: 'numeric'
  })
}
