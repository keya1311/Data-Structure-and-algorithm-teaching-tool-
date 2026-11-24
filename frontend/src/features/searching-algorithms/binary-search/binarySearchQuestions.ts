import type { PracticeQuestion } from "../../../learning/questions";
import type { BinarySearchStep } from "./types";

export type PracticeMode = "guided" | "challenge";

export function binarySearchQuestions(
  step: BinarySearchStep,
  values: number[],
  target: number,
  position: number,
  mode: PracticeMode,
): PracticeQuestion[] {
  const id = `${mode}-${position}`;
  const numeric = (
    key: string,
    prompt: string,
    answer: number,
    explanation: string,
    mistakes?: Record<string, string>,
  ): PracticeQuestion => ({
    id: `${id}-${key}`,
    kind: "number",
    prompt,
    answer: String(answer),
    explanation,
    mistakes,
  });
  const nextMid = step.low + Math.floor((step.high - step.low) / 2);
  if (
    mode === "challenge" &&
    step.operation === "initialise" &&
    values.length > 0
  ) {
    return [
      numeric(
        "mid",
        "Without revealing the next step, what will the first midpoint INDEX be?",
        nextMid,
        `The lower midpoint is ${step.low} + floor((${step.high} − ${step.low}) / 2) = ${nextMid}.`,
      ),
      numeric(
        "count",
        "How many values are initially candidates?",
        values.length,
        `Indexes ${step.low} through ${step.high}, inclusive, contain ${values.length} values.`,
      ),
    ];
  }
  if (step.operation === "compare" && step.mid !== null) {
    const mid = step.mid;
    const value = values[mid];
    const questions: PracticeQuestion[] = [];
    if (target > value) {
      questions.push(
        numeric(
          "low",
          "What should the new LOW INDEX be?",
          mid + 1,
          `The target is greater than ${value}. Exclude index ${mid} and everything before it, so low becomes ${mid + 1}.`,
          {
            [mid]:
              "Keeping the midpoint would leave a value we already know is too small.",
          },
        ),
      );
      if (mode === "challenge")
        questions.push(
          numeric(
            "count",
            "After that update, how many candidates will remain?",
            step.high - mid,
            `The new range is ${mid + 1}–${step.high}, containing ${step.high - mid} values.`,
          ),
        );
    } else if (target < value) {
      questions.push(
        numeric(
          "high",
          "What should the new HIGH INDEX be?",
          mid - 1,
          `The target is less than ${value}. Exclude index ${mid} and everything after it, so high becomes ${mid - 1}.`,
          {
            [mid]:
              "The midpoint is already known to be too large; it must be excluded.",
          },
        ),
      );
      if (mode === "challenge")
        questions.push(
          numeric(
            "count",
            "After that update, how many candidates will remain?",
            mid - step.low,
            `The new range is ${step.low}–${mid - 1}, containing ${mid - step.low} values.`,
          ),
        );
    } else {
      questions.push(
        numeric(
          "found",
          "At which INDEX has the target been found?",
          mid,
          `The midpoint value ${value} equals the target. Its index is ${mid}, not necessarily the same number as its value.`,
        ),
      );
      if (mode === "challenge")
        questions.push({
          id: `${id}-decision`,
          kind: "choice",
          prompt: "What should happen next?",
          answer: "stop",
          choices: [
            { value: "left", label: "Discard the right half" },
            { value: "right", label: "Discard the left half" },
            { value: "stop", label: "Stop: a matching index has been found" },
          ],
          explanation:
            "Equality completes this search. With duplicates, this algorithm may return any matching index.",
        });
    }
    return questions;
  }
  if (
    mode === "challenge" &&
    (step.operation === "update-low" || step.operation === "update-high")
  ) {
    if (step.low > step.high)
      return [
        {
          id: `${id}-empty`,
          kind: "choice",
          prompt: "Low is now greater than high. What does that tell you?",
          answer: "missing",
          choices: [
            {
              value: "missing",
              label: "No candidates remain: the target is absent",
            },
            { value: "middle", label: "Calculate another midpoint anyway" },
            {
              value: "restart",
              label: "The algorithm must restart from the beginning",
            },
          ],
          explanation:
            "An empty interval ends an unsuccessful search. Do not read a midpoint outside the array.",
        },
      ];
    return [
      numeric(
        "next-mid",
        "Predict the next midpoint INDEX from these updated bounds.",
        nextMid,
        `Recalculate low + floor((high − low) / 2): the next midpoint is ${nextMid}.`,
      ),
    ];
  }
  return [];
}
