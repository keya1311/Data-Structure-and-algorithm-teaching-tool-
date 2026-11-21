import { describe, expect, it } from 'vitest'
import { arrayAlgorithm, parseArrayInput } from './arrayAlgorithms'
import type { ArrayAlgorithm } from './arrayAlgorithms'

const sorts: ArrayAlgorithm[] = ['bubble', 'insertion', 'selection', 'merge', 'quick']

describe('array input', () => {
  it('accepts finite numbers, negatives, decimals and whitespace', () => {
    expect(parseArrayInput(' 3, -2, 0.5, 3 ')).toEqual([3, -2, 0.5, 3])
  })
  it('rejects missing values, invalid numbers and oversized demonstrations', () => {
    for (const input of ['', '1,,2', '1,', 'NaN', 'Infinity', '1,hello', Array(13).fill('1').join(',')]) {
      expect(() => parseArrayInput(input)).toThrow()
    }
  })
})

describe('linear search', () => {
  it('finds the first duplicate without sorting the input', () => {
    const steps = arrayAlgorithm('linear', [7, 3, 7], 7)
    expect(steps.at(-1)).toMatchObject({ phase: 'Found', active: [0], comparisons: 1, writes: 0, values: [7, 3, 7] })
  })
  it('reports an absent target only after checking every value', () => {
    expect(arrayAlgorithm('linear', [7, 3, 1], 9).at(-1)).toMatchObject({ phase: 'Not found', comparisons: 3 })
  })
  it('rejects invalid arrays and targets', () => {
    for (const values of [[], [NaN], [Infinity]]) expect(() => arrayAlgorithm('linear', values, 1)).toThrow()
    for (const target of [undefined, NaN, Infinity]) expect(() => arrayAlgorithm('linear', [1], target)).toThrow()
  })
})

for (const algorithm of sorts) {
  describe(algorithm, () => {
    it('sorts representative inputs and preserves the input array', () => {
      for (const input of [[1], [2, 1], [1, 2, 3], [3, 2, 1], [2, 2, 2], [-2, 0.5, -5, 0.5], [4, 1, 3, 2, 0]]) {
        const before = [...input]
        const steps = arrayAlgorithm(algorithm, input)
        const expected = [...input].sort((a, b) => a - b)
        expect(steps.at(-1)).toMatchObject({ phase: 'Sorted', values: expected })
        expect(input).toEqual(before)
        for (const [index, step] of steps.entries()) {
          expect(step.values).toHaveLength(input.length)
          expect(step.comparisons).toBeGreaterThanOrEqual(index ? steps[index - 1].comparisons : 0)
          expect(step.writes).toBeGreaterThanOrEqual(index ? steps[index - 1].writes : 0)
          for (const active of step.active) expect(active >= 0 && active < input.length).toBe(true)
          for (const settled of step.settled) expect(step.values[settled]).toBe(expected[settled])
          expect(step.stageCost).not.toBe('')
        }
      }
    })
    it('sorts every four-value combination of three small values', () => {
      for (let code = 0; code < 81; code += 1) {
        const input = Array.from({ length: 4 }, (_, index) => Math.floor(code / 3 ** index) % 3 - 1)
        expect(arrayAlgorithm(algorithm, input).at(-1)!.values).toEqual([...input].sort((a, b) => a - b))
      }
    })
    it('returns independent replay snapshots', () => {
      const steps = arrayAlgorithm(algorithm, [3, 1, 2])
      steps.at(-1)!.values[0] = 999
      expect(steps[0].values).toEqual([3, 1, 2])
      expect(arrayAlgorithm(algorithm, [3, 1, 2]).at(-1)!.values).toEqual([1, 2, 3])
    })
  })
}

it('shows bubble early exit, selection full scanning, and worst-case last-pivot quicksort', () => {
  const input = [1, 2, 3, 4, 5]
  expect(arrayAlgorithm('bubble', input).at(-1)!.comparisons).toBe(4)
  expect(arrayAlgorithm('insertion', input).at(-1)!.comparisons).toBe(4)
  expect(arrayAlgorithm('selection', input).at(-1)!.comparisons).toBe(10)
  expect(arrayAlgorithm('quick', input).at(-1)!.comparisons).toBe(10)
})
