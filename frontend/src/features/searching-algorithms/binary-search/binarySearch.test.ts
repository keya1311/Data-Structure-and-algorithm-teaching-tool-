import { describe, expect, it } from "vitest";
import { binarySearch } from "./binarySearch";
import { binarySearchQuestions } from "./binarySearchQuestions";
import { parseSearchInput } from "./parseSearchInput";
import { bookEntries, bookExplanation, createBookTrace } from "./bookExample";
import { checkAnswer } from "../../../learning/questions";

describe("search engine", () => {
  it("records comparisons before boundary changes and clears old midpoints", () => {
    expect(
      binarySearch([2, 5, 8, 12, 16], 12).map((s) => [
        s.operation,
        s.low,
        s.high,
        s.mid,
      ]),
    ).toEqual([
      ["initialise", 0, 4, null],
      ["midpoint", 0, 4, 2],
      ["compare", 0, 4, 2],
      ["update-low", 3, 4, null],
      ["midpoint", 3, 4, 3],
      ["compare", 3, 4, 3],
      ["found", 3, 4, 3],
    ]);
  });
  it("handles empty arrays and missing targets without reading outside the array", () => {
    for (const values of [[], [1], [1, 3], [1, 3, 5]]) {
      for (const target of [-2, 2, 8]) {
        const steps = binarySearch(values, target);
        expect(steps.at(-1)).toMatchObject({
          operation: "not-found",
          mid: null,
        });
        expect(steps.at(-1)!.low).toBeGreaterThan(steps.at(-1)!.high);
        for (const step of steps)
          if (step.mid !== null)
            expect(step.mid >= 0 && step.mid < values.length).toBe(true);
      }
    }
  });
  it("finds first/last values, duplicates, negatives and decimals", () => {
    for (const values of [
      [5],
      [2, 5],
      [-5, -1, 0, 3],
      [2, 2, 2],
      [0.5, 1.5, 2.5],
    ]) {
      for (const target of values) {
        const last = binarySearch(values, target).at(-1)!;
        expect(last.operation).toBe("found");
        expect(values[last.mid!]).toBe(target);
      }
    }
  });
  it("rejects unsorted inputs and non-finite numbers", () => {
    expect(() => binarySearch([5, 2, 8], 2)).toThrow("ascending order");
    for (const invalid of [NaN, Infinity, -Infinity]) {
      expect(() => binarySearch([invalid], 1)).toThrow("finite");
      expect(() => binarySearch([1], invalid)).toThrow("finite");
    }
  });
  it("preserves the input and recorded earlier states", () => {
    const input = [2, 5, 8, 12, 16];
    const steps = binarySearch(input, 16);
    expect(input).toEqual([2, 5, 8, 12, 16]);
    expect(steps[0]).toMatchObject({ low: 0, high: 4, mid: null });
    expect(steps.at(-1)).toMatchObject({ mid: 4, operation: "found" });
  });
  it("agrees with membership for every small sorted combination", () => {
    for (let code = 0; code < 81; code += 1) {
      const values = Array.from(
        { length: 4 },
        (_, i) => (Math.floor(code / 3 ** i) % 3) - 1,
      ).sort((a, b) => a - b);
      for (const target of [-2, -1, 0, 1, 2]) {
        const last = binarySearch(values, target).at(-1)!;
        expect(last.operation).toBe(
          values.includes(target) ? "found" : "not-found",
        );
        if (last.operation === "found") expect(values[last.mid!]).toBe(target);
      }
    }
  });
});

describe("practice questions", () => {
  it("asks for an index rather than a value during guided comparisons", () => {
    const values = [2, 5, 8, 12, 16];
    const step = binarySearch(values, 12)[2];
    const questions = binarySearchQuestions(step, values, 12, 2, "guided");
    expect(questions).toHaveLength(1);
    expect(checkAnswer(questions[0], "3").correct).toBe(true);
    expect(checkAnswer(questions[0], "12").correct).toBe(false);
    expect(checkAnswer(questions[0], "2").message).toContain(
      "Keeping the midpoint",
    );
  });
  it("adds multi-part predictions and updated midpoint questions in challenge mode", () => {
    const values = [2, 5, 8, 12, 16];
    const steps = binarySearch(values, 12);
    const initial = binarySearchQuestions(steps[0], values, 12, 0, "challenge");
    expect(initial.map((q) => q.answer)).toEqual(["2", "5"]);
    expect(
      binarySearchQuestions(steps[2], values, 12, 2, "challenge").map(
        (q) => q.answer,
      ),
    ).toEqual(["3", "2"]);
    expect(
      binarySearchQuestions(steps[3], values, 12, 3, "challenge")[0].answer,
    ).toBe("3");
  });
  it("handles leftward moves, equality and empty intervals", () => {
    const values = [2, 5, 8];
    const left = binarySearch(values, 0);
    const compare = left.findIndex((s) => s.operation === "compare");
    expect(
      binarySearchQuestions(left[compare], values, 0, compare, "challenge").map(
        (q) => q.answer,
      ),
    ).toEqual(["0", "1"]);
    const empty = left.findIndex((s) => s.low > s.high);
    expect(
      binarySearchQuestions(left[empty], values, 0, empty, "challenge")[0]
        .answer,
    ).toBe("missing");
    const equal = binarySearch(values, 5)[2];
    expect(
      binarySearchQuestions(equal, values, 5, 2, "challenge").map(
        (q) => q.answer,
      ),
    ).toEqual(["1", "stop"]);
  });
  it("checks blanks, malformed numbers, valid zero and negative indexes", () => {
    const question = binarySearchQuestions(
      binarySearch([2], 0)[2],
      [2],
      0,
      2,
      "guided",
    )[0];
    expect(checkAnswer(question, "").correct).toBe(false);
    expect(checkAnswer(question, "abc").correct).toBe(false);
    expect(checkAnswer(question, "0.5").correct).toBe(false);
    expect(checkAnswer(question, "-1").correct).toBe(true);
    const found = binarySearchQuestions(
      binarySearch([2], 2)[2],
      [2],
      2,
      2,
      "guided",
    )[0];
    expect(checkAnswer(found, "0").correct).toBe(true);
  });
});

describe("book and input preparation", () => {
  it("keeps the miniature glossary alphabetically sorted", () => {
    for (let index = 1; index < bookEntries.length; index += 1)
      expect(
        bookEntries[index - 1].word.localeCompare(
          bookEntries[index].word,
          "en",
        ),
      ).toBeLessThan(0);
  });
  it("finds each glossary word with the shared engine and explains its page", () => {
    for (const [index, entry] of bookEntries.entries()) {
      const last = createBookTrace(entry.word).at(-1)!;
      expect(last).toMatchObject({ operation: "found", mid: index });
      expect(bookExplanation(last, entry.word)).toContain(`page ${index + 1}`);
    }
    expect(createBookTrace("Zebra").at(-1)!.operation).toBe("not-found");
  });
  it("parses numeric input and rejects empty, malformed or oversized input", () => {
    expect(parseSearchInput(" -2, 0, 1.5 ", "0")).toEqual({
      values: [-2, 0, 1.5],
      target: 0,
    });
    for (const input of ["", "1,,2", "NaN", Array(32).fill("1").join(",")])
      expect(() => parseSearchInput(input, "1")).toThrow();
    for (const target of ["", "NaN", "Infinity"])
      expect(() => parseSearchInput("1,2", target)).toThrow();
  });
});
