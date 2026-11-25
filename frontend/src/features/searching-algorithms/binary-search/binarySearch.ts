import type { BinarySearchStep } from "./types";

export function binarySearch(
  values: number[], 
  target: number,
): BinarySearchStep[] {  //The function returns type BinarySearchStep
  if (!Number.isFinite(target)) {
    throw new Error("The target must be a finite number.");
  }
  for (let index = 0; index < values.length; index += 1) {
    if (!Number.isFinite(values[index])) {
      throw new Error("Every array value must be a finite number.");
    }
    if (index > 0 && values[index] < values[index - 1]) { //This checks that the array is sorted
      throw new Error(
        "Binary search requires an array sorted in ascending order. Sort the values before starting.",
      );
    }
  }

  let low = 0;
  let high = values.length - 1;
  const steps: BinarySearchStep[] = [
    {
      operation: "initialise",
      low,
      high,
      mid: null,
      explanation: values.length
        ? `Start with all candidates: low = ${low}, high = ${high}.`
        : "The array is empty, so there are no candidates.", //Checking if there is an existing array then low =value of low etc. If not, display a message to the user. 
    },
  ];
  while (low <= high) {
    const mid = low + Math.floor((high - low) / 2);
    steps.push({
      operation: "midpoint",
      low,
      high,
      mid,
      explanation: `Choose midpoint index ${mid}, containing ${values[mid]}.`,
    });
    if (target < values[mid]) {
      steps.push({
        operation: "compare",
        low,
        high,
        mid,
        explanation: `${target} is less than ${values[mid]}. Exclude the midpoint and everything to its right.`,
      });
      const previousHigh = high;
      high = mid - 1;
      steps.push({
        operation: "update-high",
        low,
        high,
        mid: null,
        explanation: `Move high from index ${previousHigh} to ${high}. The next midpoint has not been chosen yet.`,
      });
    } else if (target > values[mid]) {
      steps.push({
        operation: "compare",
        low,
        high,
        mid,
        explanation: `${target} is greater than ${values[mid]}. Exclude the midpoint and everything to its left.`,
      });
      const previousLow = low;
      low = mid + 1;
      steps.push({
        operation: "update-low",
        low,
        high,
        mid: null,
        explanation: `Move low from index ${previousLow} to ${low}. The next midpoint has not been chosen yet.`,
      });
    } else {
      steps.push({
        operation: "compare",
        low,
        high,
        mid,
        explanation: `${target} equals ${values[mid]} at index ${mid}.`,
      });
      steps.push({
        operation: "found",
        low,
        high,
        mid,
        explanation: `Found ${target} at index ${mid}. The search is complete.`,
      });
      return steps;
    }
  }
  steps.push({
    operation: "not-found",
    low,
    high,
    mid: null,
    explanation: `${target} is not in the array. Low (${low}) is greater than high (${high}), so no candidates remain.`,
  });
  return steps;   //if the number is not in the array
}
