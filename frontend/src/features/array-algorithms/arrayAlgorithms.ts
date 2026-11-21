export type ArrayAlgorithm = 'linear' | 'bubble' | 'insertion' | 'selection' | 'merge' | 'quick'

export interface ArrayStep {
  values: number[]
  active: number[]
  settled: number[]
  phase: string
  explanation: string
  comparisons: number
  writes: number
  stageCost: string
}

export const algorithmDetails: Record<ArrayAlgorithm, { name: string; time: string; space: string; description: string }> = {
  linear: { name: 'Linear search', time: 'Best O(1); average/worst O(n)', space: 'O(1) auxiliary space', description: 'Check each value from left to right. Unlike binary search, the input does not need to be sorted. Stop at the first match.' },
  bubble: { name: 'Bubble sort', time: 'Best O(n); average/worst O(n²)', space: 'O(1) auxiliary space', description: 'Compare neighbours and swap out-of-order pairs. Each pass places the largest remaining value at the end. Stop early when a pass makes no swaps.' },
  insertion: { name: 'Insertion sort', time: 'Best O(n); average/worst O(n²)', space: 'O(1) auxiliary space', description: 'Grow a sorted prefix. Hold the next value, shift larger values to the right, then insert the held value into the gap.' },
  selection: { name: 'Selection sort', time: 'Best/average/worst O(n²)', space: 'O(1) auxiliary space', description: 'Find the smallest value in the unsorted suffix, then move it to the next final position. Sorted input still needs the same scan.' },
  merge: { name: 'Merge sort', time: 'Best/average/worst O(n log n)', space: 'O(n) auxiliary buffer + O(log n) recursion', description: 'Split into halves until each range has one value. Merge sorted ranges by repeatedly choosing the smaller front value.' },
  quick: { name: 'Quicksort', time: 'Best/average O(n log n); worst O(n²)', space: 'O(log n) typical recursion; O(n) worst', description: 'Use the last value as a pivot. Partition smaller or equal values to its left, place the pivot, and recursively sort each side. A fixed last pivot can be poor on sorted input.' },
}

export function parseArrayInput(input: string): number[] {
  const entries = input.split(',').map(entry => entry.trim())
  if (entries.some(entry => entry === '')) throw new Error('Enter comma-separated numbers without empty entries.')
  if (entries.length > 12) throw new Error('Use at most 12 values so the steps remain readable.')
  const values = entries.map(Number)
  if (values.some(value => !Number.isFinite(value))) throw new Error('Every value must be a finite number.')
  return values
}

export function arrayAlgorithm(algorithm: ArrayAlgorithm, input: number[], target?: number): ArrayStep[] {
  if (input.length === 0 || input.some(value => !Number.isFinite(value))) throw new Error('Provide a non-empty array of finite numbers.')
  if (algorithm === 'linear' && (target === undefined || !Number.isFinite(target))) throw new Error('Enter a finite target number.')
  const values = [...input]
  const steps: ArrayStep[] = []
  let comparisons = 0
  let writes = 0
  const record = (phase: string, explanation: string, active: number[] = [], settled: number[] = [], stageCost = 'O(1) algorithm action') => {
    steps.push({ values: [...values], active: [...active], settled: [...settled], phase, explanation, comparisons, writes, stageCost })
  }
  const swap = (left: number, right: number) => {
    if (left !== right) {
      const saved = values[left]
      values[left] = values[right]
      values[right] = saved
      writes += 2
    }
  }
  const prefix = (end: number) => Array.from({ length: end }, (_, index) => index)
  record('Ready', 'The input is copied; your original array will not be changed.', [], [], 'O(n) input validation and demonstration copy')

  if (algorithm === 'linear') {
    for (let index = 0; index < values.length; index += 1) {
      comparisons += 1
      record('Compare', `Compare index ${index}, value ${values[index]}, with target ${target}.`, [index])
      if (values[index] === target) {
        record('Found', `Found ${target} at index ${index}. This is the first match.`, [index], [index])
        return steps
      }
    }
    record('Not found', `${target} is not present. All ${values.length} values were checked.`)
    return steps
  }

  if (algorithm === 'bubble') {
    for (let end = values.length - 1; end > 0; end -= 1) {
      let changed = false
      const settled = prefix(values.length).filter(index => index > end)
      for (let index = 0; index < end; index += 1) {
        comparisons += 1
        record('Compare neighbours', `Compare ${values[index]} and ${values[index + 1]}.`, [index, index + 1], settled)
        if (values[index] > values[index + 1]) {
          swap(index, index + 1)
          changed = true
          record('Swap', 'The left value was larger, so swap the pair.', [index, index + 1], settled)
        }
      }
      record('Pass complete', `Index ${end} is now in its final position.${changed ? '' : ' No swaps: the whole array is sorted.'}`, [], prefix(values.length).filter(index => index >= end), `This pass made ${end} comparisons: O(k) for a suffix boundary k`)
      if (!changed) break
    }
  }

  if (algorithm === 'insertion') {
    for (let index = 1; index < values.length; index += 1) {
      const held = values[index]
      let cursor = index - 1
      record('Hold a value', `Hold ${held} from index ${index}; the prefix before it is sorted, but not necessarily final.`, [index])
      while (cursor >= 0) {
        comparisons += 1
        record('Compare with held value', `Compare ${values[cursor]} with held value ${held}.`, [cursor, cursor + 1])
        if (values[cursor] <= held) break
        values[cursor + 1] = values[cursor]
        writes += 1
        record('Shift right', `Shift ${values[cursor]} right. The held value ${held} is temporarily outside the array; the gap is at index ${cursor}.`, [cursor, cursor + 1])
        cursor -= 1
      }
      values[cursor + 1] = held
      writes += 1
      record('Insert held value', `Insert ${held} at index ${cursor + 1}. Indexes 0–${index} now form a sorted prefix.`, [cursor + 1], [], 'O(1) placement; finding the gap can take O(k) for a prefix of length k')
    }
  }

  if (algorithm === 'selection') {
    for (let start = 0; start < values.length - 1; start += 1) {
      let smallest = start
      record('Find the minimum', `Find the minimum from index ${start} to ${values.length - 1}.`, [smallest], prefix(start))
      for (let index = start + 1; index < values.length; index += 1) {
        comparisons += 1
        record('Compare candidate', `Compare ${values[index]} with current minimum ${values[smallest]}.`, [smallest, index], prefix(start))
        if (values[index] < values[smallest]) {
          smallest = index
          record('New minimum', `${values[smallest]} is the smallest value seen in this scan.`, [smallest], prefix(start))
        }
      }
      swap(start, smallest)
      record('Place minimum', `Place the minimum at index ${start}; that position is final.`, [start], prefix(start + 1), 'O(1) placement after an O(k) suffix scan')
    }
  }

  if (algorithm === 'merge') {
    const sortRange = (low: number, high: number) => {
      if (low >= high) return
      const mid = low + Math.floor((high - low) / 2)
      record('Split range', `Split indexes ${low}–${high} into ${low}–${mid} and ${mid + 1}–${high}.`, [low, mid, high], [], 'O(1) split; balanced recursion has O(log n) levels')
      sortRange(low, mid)
      sortRange(mid + 1, high)
      const left = values.slice(low, mid + 1)
      const right = values.slice(mid + 1, high + 1)
      record('Prepare merge', 'Copy the two sorted ranges into temporary buffers. The original range is overwritten as the merge progresses.', [low, high], [], 'O(k) time and O(k) buffer space for a range of k values')
      let i = 0
      let j = 0
      let destination = low
      while (i < left.length || j < right.length) {
        let takeLeft = j >= right.length
        if (i < left.length && j < right.length) {
          comparisons += 1
          record('Compare buffer fronts', `Compare left-buffer value ${left[i]} with right-buffer value ${right[j]}.`, [destination])
          takeLeft = left[i] <= right[j]
        }
        values[destination] = takeLeft ? left[i++] : right[j++]
        writes += 1
        record('Write merged value', `Write ${values[destination]} at index ${destination}. Remaining values are still held in the buffers.`, [destination])
        destination += 1
      }
      record('Merge complete', `Indexes ${low}–${high} are sorted. A subrange may still move during a later merge.`, [low, high], [], 'O(k) total merge work for this range; O(n) merge work at each recursion level')
    }
    sortRange(0, values.length - 1)
  }

  if (algorithm === 'quick') {
    const settled: number[] = []
    const sortRange = (low: number, high: number) => {
      if (low > high) return
      if (low === high) {
        settled.push(low)
        record('Single value', `Index ${low} is already in its final position.`, [low], settled)
        return
      }
      const pivot = values[high]
      let boundary = low
      record('Choose pivot', `Use ${pivot} at index ${high} as the pivot for indexes ${low}–${high}.`, [high], settled)
      for (let index = low; index < high; index += 1) {
        comparisons += 1
        record('Compare with pivot', `Compare ${values[index]} with pivot ${pivot}.`, [index, high], settled)
        if (values[index] <= pivot) {
          swap(boundary, index)
          record('Extend smaller partition', `Place ${values[boundary]} in the smaller-or-equal partition, ending at index ${boundary}.`, [boundary, index, high], settled)
          boundary += 1
        }
      }
      swap(boundary, high)
      settled.push(boundary)
      record('Place pivot', `Pivot ${pivot} is final at index ${boundary}. Sort the ranges on either side.`, [boundary], settled, 'O(1) pivot placement after O(k) partition work; balanced partitions are not guaranteed')
      sortRange(low, boundary - 1)
      sortRange(boundary + 1, high)
    }
    sortRange(0, values.length - 1)
  }

  record('Sorted', 'The array is sorted in ascending order.', [], prefix(values.length), 'O(1) algorithm completion; rendering and recording are separate overhead')
  return steps
}
