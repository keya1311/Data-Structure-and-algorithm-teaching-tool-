import { useState } from "react";
import type { SubmitEvent } from "react";
import SimulationPlayer from "../../../components/simulation/SimulationPlayer";
import QuestionPanel from "../../../components/questions/QuestionPanel";
import { checkAnswer } from "../../../learning/questions";
import type {
  CheckedAnswer,
  PracticeQuestion,
} from "../../../learning/questions";
import { binarySearch } from "./binarySearch";
import { binarySearchQuestions } from "./binarySearchQuestions";
import type { PracticeMode } from "./binarySearchQuestions";
import { parseSearchInput } from "./parseSearchInput";
import type { BinarySearchStep } from "./types";
import BinarySearchArray from "./BinarySearchArray";

const challenges = [
  {
    values: "-8, -3, 0, 4, 9, 12, 18, 23, 31, 40, 56",
    target: "23",
    description:
      "A longer array: predict both boundaries and candidate counts.",
  },
  {
    values: "-8, -3, 0, 4, 9, 12, 18, 23, 31, 40, 56",
    target: "22",
    description:
      "An absent target: recognise when the candidate interval becomes empty.",
  },
  {
    values: "-4, -4, 1, 1, 1, 7, 11, 18",
    target: "1",
    description:
      "Duplicate values: finding any matching index completes this version of binary search.",
  },
];

export default function PracticeSimulation({ mode }: { mode: PracticeMode }) {
  const hard = mode === "challenge";
  const [arrayText, setArrayText] = useState(
    hard ? challenges[0].values : "2, 5, 8, 12, 16",
  );
  const [targetText, setTargetText] = useState(
    hard ? challenges[0].target : "12",
  );
  const [run, setRun] = useState<{
    values: number[];
    target: number;
    steps: BinarySearchStep[];
  } | null>(null);
  const [answers, setAnswers] = useState<Record<string, CheckedAnswer>>({});
  const [runVersion, setRunVersion] = useState(0);
  const [challenge, setChallenge] = useState(0);
  const [error, setError] = useState("");
  const title = hard
    ? "Simulation 3 · Independent challenge"
    : "Simulation 2 · Guided practice";

  function clearRun() {
    setRun(null);
    setAnswers({});
    setError("");
  }

  function start(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    clearRun();
    try {
      const input = parseSearchInput(arrayText, targetText);
      const steps = binarySearch(input.values, input.target);
      setRun({ ...input, steps });
      setRunVersion((current) => current + 1);
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Unable to start this search.",
      );
    }
  }

  function anotherChallenge() {
    const next = (challenge + 1) % challenges.length;
    setChallenge(next);
    setArrayText(challenges[next].values);
    setTargetText(challenges[next].target);
    clearRun();
  }

  function answerQuestion(question: PracticeQuestion, response: string) {
    setAnswers((current) => ({
      ...current,
      [question.id]: checkAnswer(question, response),
    }));
  }

  function questionsAt(position: number) {
    return run
      ? binarySearchQuestions(
          run.steps[position],
          run.values,
          run.target,
          position,
          mode,
        )
      : [];
  }

  return (
    <section aria-labelledby={`${mode}-heading`} id={`${mode}-practice`}>
      <h2 id={`${mode}-heading`}>{title}</h2>
      <p>
        {hard
          ? "Make more decisions without the demonstration’s hints. Predict midpoint indexes, boundary changes and remaining candidate counts. Some questions have more than one part."
          : "Enter a sorted array and choose a target. Move one step at a time. At comparisons, predict the next action before the algorithm reveals it."}
      </p>
      <p>
        Correct answers unlock Next. Incorrect answers receive an explanation
        and can be retried. Previous lets you review earlier steps.
      </p>
      {hard && (
        <p>
          {challenges[challenge].description}{" "}
          <button type="button" onClick={anotherChallenge}>
            Try another challenge
          </button>
        </p>
      )}
      <form className="search-input" onSubmit={start} noValidate>
        <label htmlFor={`${mode}-array`}>
          Sorted numbers{" "}
          <input
            id={`${mode}-array`}
            value={arrayText}
            aria-describedby={`${mode}-help ${mode}-error`}
            onChange={(event) => {
              setArrayText(event.target.value);
              clearRun();
            }}
          />
        </label>
        <label htmlFor={`${mode}-target`}>
          Target{" "}
          <input
            id={`${mode}-target`}
            value={targetText}
            inputMode="decimal"
            aria-describedby={`${mode}-error`}
            onChange={(event) => {
              setTargetText(event.target.value);
              clearRun();
            }}
          />
        </label>
        <button type="submit">Start {hard ? "challenge" : "practice"}</button>
      </form>
      <p id={`${mode}-help`}>
        Use up to 31 finite numbers, separated by commas, in ascending order.
        Negative values, decimals and duplicates are allowed. The target may be
        absent.
      </p>
      <p id={`${mode}-error`} role="alert">
        {error}
      </p>
      {run && (
        <SimulationPlayer
          key={runVersion}
          id={mode}
          stepCount={run.steps.length}
          canAdvance={(position) =>
            questionsAt(position).every(
              (question) => answers[question.id]?.correct,
            )
          }
          onRestart={() => setAnswers({})}
        >
          {(position, restartVersion) => {
            const step = run.steps[position];
            const questions = questionsAt(position);
            const ready = questions.every(
              (question) => answers[question.id]?.correct,
            );
            return (
              <>
                <BinarySearchArray
                  values={run.values}
                  target={run.target}
                  step={step}
                />
                <div
                  className="step-message"
                  role="status"
                  aria-live="polite"
                  aria-atomic="true"
                >
                  <strong>{step.operation}</strong>
                  <p>
                    {ready
                      ? step.explanation
                      : hard
                        ? "Use the current state to make your predictions. The next operation is not revealed until you answer."
                        : "Compare the target with the midpoint value, then predict how the search should change."}
                  </p>
                </div>
                {questions.length > 0 && (
                  <QuestionPanel
                    key={`${position}-${restartVersion}`}
                    questions={questions}
                    answers={answers}
                    onCheck={answerQuestion}
                  />
                )}
                {position === run.steps.length - 1 && (
                  <p role="status">
                    <strong>
                      {hard ? "Challenge" : "Guided practice"} complete.
                    </strong>{" "}
                    {step.operation === "found"
                      ? `The target was found at index ${step.mid}.`
                      : "You correctly completed a search with no matching value."}{" "}
                    You can restart or try another input.
                  </p>
                )}
              </>
            );
          }}
        </SimulationPlayer>
      )}
    </section>
  );
}
