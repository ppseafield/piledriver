import { describe, test, expect } from 'vitest'
import { formatters as f } from './shared/utils/date-formatters'

describe('date formatters', () => {
  test('individual formatters', () => {
    const date = new Date('2025-04-07 12:24:15-8:00')
    expect(f.y.format(date)).toBe('25')
    expect(f.Y.format(date)).toBe('2025')
    expect(f.m.format(date)).toBe('4')
    expect(f.M.format(date)).toBe('April')
    expect(f.d.format(date)).toBe('7')
    expect(f.wd.format(date)).toBe('Mon')
    expect(f.WD.format(date)).toBe('Monday')
  })

  // todo: escape strings like 'morning routine: {WD}, {M} {d}'
})
