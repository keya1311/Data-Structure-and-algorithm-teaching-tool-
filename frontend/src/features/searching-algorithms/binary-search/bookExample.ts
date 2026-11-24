import { binarySearch } from "./binarySearch";
import type { BinarySearchStep } from "./types";

export const bookEntries = [
  {
    word: "Algorithm",
    definition: "A sequence of instructions for solving a problem.",
  },
  { word: "Array", definition: "An indexed collection of values." },
  {
    word: "Binary search",
    definition: "A search that repeatedly halves a sorted candidate range.",
  },
  {
    word: "Complexity",
    definition: "How resource requirements grow as an input gets larger.",
  },
  { word: "Data", definition: "Values that a program stores and processes." },
  { word: "Graph", definition: "A collection of vertices connected by edges." },
  {
    word: "Hash",
    definition: "A computed value used to help locate a key efficiently.",
  },
  {
    word: "Heap",
    definition: "A tree-shaped structure that maintains an ordering rule.",
  },
  {
    word: "Index",
    definition: "A position used to access an item in a collection.",
  },
  {
    word: "Linked list",
    definition: "A sequence of nodes connected by links.",
  },
  {
    word: "Queue",
    definition: "A collection normally processed first in, first out.",
  },
  {
    word: "Recursion",
    definition:
      "Solving a problem using smaller instances of the same problem.",
  },
  {
    word: "Sorting",
    definition: "Arranging values according to an ordering rule.",
  },
  {
    word: "Stack",
    definition: "A collection normally processed last in, first out.",
  },
  {
    word: "Tree",
    definition: "A hierarchical structure connecting parent and child nodes.",
  },
];

export function createBookTrace(target: string) {
  const comparisons = bookEntries.map((entry) =>
    Math.sign(entry.word.localeCompare(target, "en")),
  );
  return binarySearch(comparisons, 0);
}

export function bookExplanation(step: BinarySearchStep, target: string) {
  if (step.operation === "initialise")
    return `The glossary is alphabetical. Start with all ${bookEntries.length} pages as candidates for “${target}”.`;
  if (step.operation === "midpoint")
    return `Open page ${step.mid! + 1}, near the middle of the remaining range. Its entry is “${bookEntries[step.mid!].word}”.`;
  if (step.operation === "compare") {
    const word = bookEntries[step.mid!].word;
    const comparison = target.localeCompare(word, "en");
    return comparison === 0
      ? `“${word}” is the word we wanted.`
      : comparison > 0
        ? `“${target}” comes after “${word}” alphabetically. The pages up to this one cannot contain it.`
        : `“${target}” comes before “${word}” alphabetically. This page and the later pages cannot contain it.`;
  }
  if (step.operation === "update-low" || step.operation === "update-high")
    return step.low <= step.high
      ? `Keep pages ${step.low + 1}–${step.high + 1}. Open the middle of this smaller range next.`
      : "The page interval is empty. There is nowhere left to look.";
  if (step.operation === "found")
    return `Found “${target}” on page ${step.mid! + 1}. The search is complete.`;
  return `“${target}” is not in this glossary. No candidate pages remain.`;
}
