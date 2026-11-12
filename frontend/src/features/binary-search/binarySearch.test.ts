import { describe, expect, it } from 'vitest'
import { binarySearch } from './binarySearch'

describe('binary search demonstration validation', () => {
  it('rejects an empty array', () => {
    expect(() => binarySearch([], 5)).toThrow('Enter at least one array value')
  })
  it('rejects unsorted and reverse-sorted arrays', () => {
    expect(() => binarySearch([2, 8, 5], 5)).toThrow('sorted in ascending order')
    expect(() => binarySearch([8, 5, 2], 5)).toThrow('sorted in ascending order')
  })
  it('explains when the target is absent', () => {
    expect(() => binarySearch([2, 8, 12], 5)).toThrow('The target 5 is not in this array')
  })
  it('rejects non-finite array values and targets', () => {
    for (const invalid of [NaN, Infinity, -Infinity]) {
      expect(() => binarySearch([invalid], 5)).toThrow('Every array value must be a finite number')
      expect(() => binarySearch([5], invalid)).toThrow('The target must be a finite number')
    }
  })
})

describe('binary search execution steps', () => {
  it('records comparison before moving low and clears the old midpoint', () => {
    const steps = binarySearch([2, 5, 8, 12, 16], 12)
    expect(steps.map(step => [step.operation, step.low, step.high, step.mid])).toEqual([
      ['initialise', 0, 4, null], ['midpoint', 0, 4, 2], ['compare', 0, 4, 2],
      ['update-low', 3, 4, null], ['midpoint', 3, 4, 3], ['compare', 3, 4, 3], ['found', 3, 4, 3],
    ])
    expect(steps[3].explanation).toContain('from index 0 to 3')
  })
  it('records the upper boundary moving after a comparison', () => {
    const steps = binarySearch([2, 5, 8, 12, 16], 2)
    expect(steps[2].operation).toBe('compare')
    expect(steps[3]).toMatchObject({ operation: 'update-high', low: 0, high: 1, mid: null })
    expect(steps[3].explanation).toContain('from index 4 to 1')
  })
  it('finds every target in representative sorted arrays', () => {
    for (const values of [[5], [2, 5], [-10, -4, 0, 3, 9], [1, 2, 3, 4, 5, 6], [2, 2, 2], [0.5, 1.5, 2.5]]) {
      for (const target of values) {
        const steps = binarySearch(values, target)
        const final = steps[steps.length - 1]
        expect(final.operation).toBe('found')
        expect(final.mid).not.toBeNull()
        expect(values[final.mid!]).toBe(target)
        for (const step of steps) {
          expect(step.low).toBeGreaterThanOrEqual(0)
          expect(step.high).toBeLessThan(values.length)
          expect(step.low).toBeLessThanOrEqual(step.high)
          expect(values.slice(step.low, step.high + 1)).toContain(target)
        }
      }
    }
  })
  it('does not mutate the input or previously recorded bounds', () => {
    const values = [2, 5, 8, 12, 16]
    const original = [...values]
    const steps = binarySearch(values, 16)
    expect(values).toEqual(original)
    expect(steps[0]).toMatchObject({ low: 0, high: 4, mid: null })
    expect(steps[steps.length - 1]).toMatchObject({ operation: 'found', mid: 4 })
  })
})
