import { Temporal } from 'temporal-polyfill'

export function nowTemporal(): string {
  return Temporal.Now.zonedDateTimeISO().toString({ timeZoneName: 'never' })
}

export function twoWeeksAgo(): string {
  return Temporal.Now.plainDateISO().subtract({ days: 14 }).toString()
}
