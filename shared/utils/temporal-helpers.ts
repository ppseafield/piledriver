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
 * Returns a postgres `timestamptz` value for two weeks from now.
 *
 * @returns The timestamp for two weeks from now
 */
export function twoWeeksFromNow(): string {
  return Temporal.Now.zonedDateTimeISO()
    .add({ days: 14 })
    .toString({ timeZoneName: 'never' })
}

/**
 * Returns a postgres `timestamptz` value for ten minutes ago.
 *
 * @returns The timestamp for ten minutes ago
 */
export function tenMinutesAgo(): string {
  return Temporal.Now.zonedDateTimeISO()
    .subtract({ seconds: 5 })
    // .subtract({ minutes: 10 })
    .toString({ timeZoneName: 'never' })
}

/**
 * Takes a postgres timestamp with timezone and returns a nice, localized formatted date.
 * @param datestring - timestamp with timezone from postgres
 * @returns a nice formatted date
 */
export function shortDate(datestring: string): string {
  return Temporal.Instant.from(datestring).toLocaleString(undefined, {
    month: 'short', day: 'numeric', year: 'numeric'
  })
}

/**
 * Takes a postgres timestamp with timezone and returns a date object.
 * @param datestring - timestamp with timezone from postgres
 * @returns a Date object
 */
export function dateFromTimestamptz(datestring: string): Date {
  return new Date(Temporal.Instant.from(datestring).epochMilliseconds)
}

