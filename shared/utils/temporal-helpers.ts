import { Temporal } from '@js-temporal/polyfill'

/**
 * Returns a postgres `timestamptz` value for the current time.
 *
 * @returns The timestamp for the current time.
 */
export function nowTemporal(): string {
  return Temporal.Now.zonedDateTimeISO()
    .toString({ timeZoneName: 'never' })
}

/**
 * Returns a postgres `timestamptz` value for two weeks ago.
 *
 * @returns The timestamp for two weeks ago
 */
export function twoWeeksAgo(): string {
  return Temporal.Now.zonedDateTimeISO()
    .subtract({ days: 14 })
    .toString({ timeZoneName: 'never' })
}

/**
 * Takes a postgres timestamp with timezone and returns a nice, localized formatted date
 * @param datestring - timestamp with timezone from postgres
 * @returns a nice formatted date
 */
export function shortDate(datestring: string): string {
  return Temporal.Instant.from(datestring).toLocaleString(undefined, {
    month: 'short', day: 'numeric', year: 'numeric'
  })
}

