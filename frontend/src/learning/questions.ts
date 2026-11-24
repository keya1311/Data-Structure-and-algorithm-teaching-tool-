export interface PracticeQuestion {
  id: string;
  prompt: string;
  kind: "number" | "choice";
  answer: string;
  explanation: string;
  choices?: { value: string; label: string }[];
  mistakes?: Record<string, string>;
}

export interface CheckedAnswer {
  response: string;
  correct: boolean;
  message: string;
}

export function checkAnswer(
  question: PracticeQuestion,
  response: string,
): CheckedAnswer {
  const trimmed = response.trim();
  if (!trimmed)
    return {
      response,
      correct: false,
      message: "Enter or select an answer before checking it.",
    };
  if (
    question.kind === "number" &&
    (!Number.isFinite(Number(trimmed)) || !Number.isInteger(Number(trimmed)))
  ) {
    return {
      response,
      correct: false,
      message:
        "Use a whole-number index or count. Indexes can become -1 when the search interval is empty.",
    };
  }
  const correct =
    question.kind === "number"
      ? Number(trimmed) === Number(question.answer)
      : trimmed === question.answer;
  const reason = question.mistakes?.[trimmed];
  return {
    response,
    correct,
    message: correct
      ? `Correct. ${question.explanation}`
      : `${reason ?? "That answer does not match the current search state."} ${question.explanation} Try again before continuing.`,
  };
}
