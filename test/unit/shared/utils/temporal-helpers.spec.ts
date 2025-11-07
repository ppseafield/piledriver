import { describe, test, expect } from 'vitest'
import * as th from './shared/utils/temporal-helpers'

describe('temporal helpers', () => {
  test('dateFromTimestamptz returns correct date object', () => {
    const date = new Date('2025-11-07 12:07:15Z') // iso with out T separator for Date()
    const str = '2025-11-07T12:07:15.000000Z' // iso with T separator coming from database
    expect(date.valueOf()).toBe(th.dateFromTimestamptz(str).valueOf())
  })
})

