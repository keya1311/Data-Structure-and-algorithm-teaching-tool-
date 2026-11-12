export interface BinarySearchStep {
  operation: 'initialise' | 'midpoint' | 'compare' | 'update-low' | 'update-high' | 'found'
  low: number
  high: number
  mid: number | null
  explanation: string
}

export function binarySearch(values: number[], target: number): BinarySearchStep[] {
  if (values.length === 0) {
    throw new Error('Enter at least one array value before starting.')
  }
  if (!Number.isFinite(target)) {
    throw new Error('The target must be a finite number.')
  }
  for (let index = 0; index < values.length; index += 1) {
    if (!Number.isFinite(values[index])) {
      throw new Error('Every array value must be a finite number.')
    }
    if (index > 0 && values[index] < values[index - 1]) {
      throw new Error('Binary search requires an array sorted in ascending order. Sort the values before starting.')
    }
  }
  if (!values.includes(target)) {
    throw new Error(`The target ${target} is not in this array. Choose a value from the array to run this demonstration.`)
  }

  let low = 0
  let high = values.length - 1
  const steps: BinarySearchStep[] = [{
    operation: 'initialise', low, high, mid: null,
    explanation: `Start with all candidates: low = ${low}, high = ${high}.`,
  }]
  while (low <= high) {
    const mid = low + Math.floor((high - low) / 2)
    steps.push({
      operation: 'midpoint', low, high, mid,
      explanation: `Choose midpoint index ${mid}, containing ${values[mid]}.`,
    })
    if (target < values[mid]) {
      steps.push({
        operation: 'compare', low, high, mid,
        explanation: `${target} is less than ${values[mid]}. Exclude the midpoint and everything to its right.`,
      })
      const previousHigh = high
      high = mid - 1
      steps.push({
        operation: 'update-high', low, high, mid: null,
        explanation: `Move high from index ${previousHigh} to ${high}. The next midpoint has not been chosen yet.`,
      })
    } else if (target > values[mid]) {
      steps.push({
        operation: 'compare', low, high, mid,
        explanation: `${target} is greater than ${values[mid]}. Exclude the midpoint and everything to its left.`,
      })
      const previousLow = low
      low = mid + 1
      steps.push({
        operation: 'update-low', low, high, mid: null,
        explanation: `Move low from index ${previousLow} to ${low}. The next midpoint has not been chosen yet.`,
      })
    } else {
      steps.push({
        operation: 'compare', low, high, mid,
        explanation: `${target} equals ${values[mid]} at index ${mid}.`,
      })
      steps.push({
        operation: 'found', low, high, mid,
        explanation: `Found ${target} at index ${mid}. The search is complete.`,
      })
      return steps
    }
  }
  return steps
}
