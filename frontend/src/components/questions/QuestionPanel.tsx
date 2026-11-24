import { useState } from "react";
import type { SubmitEvent } from "react";
import type { CheckedAnswer, PracticeQuestion } from "../../learning/questions";

function QuestionField({
  question,
  checked,
  onCheck,
}: {
  question: PracticeQuestion;
  checked?: CheckedAnswer;
  onCheck: (question: PracticeQuestion, response: string) => void;
}) {
  const [response, setResponse] = useState(checked?.response ?? "");
  function submit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    onCheck(question, response);
  }
  return (
    <form onSubmit={submit} className="question-form">
      <label htmlFor={question.id}>{question.prompt}</label>
      {question.kind === "number" ? (
        <input
          id={question.id}
          inputMode="numeric"
          value={response}
          disabled={checked?.correct}
          aria-describedby={checked ? `${question.id}-feedback` : undefined}
          onChange={(event) => setResponse(event.target.value)}
        />
      ) : (
        <select
          id={question.id}
          value={response}
          disabled={checked?.correct}
          aria-describedby={checked ? `${question.id}-feedback` : undefined}
          onChange={(event) => setResponse(event.target.value)}
        >
          <option value="">Choose an answer</option>
          {question.choices?.map((choice) => (
            <option key={choice.value} value={choice.value}>
              {choice.label}
            </option>
          ))}
        </select>
      )}
      <button type="submit" disabled={checked?.correct}>
        {checked?.correct ? "Answered correctly" : "Check answer"}
      </button>
      {checked && (
        <p id={`${question.id}-feedback`} role="status">
          {checked.message}
        </p>
      )}
    </form>
  );
}

export default function QuestionPanel({
  questions,
  answers,
  onCheck,
}: {
  questions: PracticeQuestion[];
  answers: Record<string, CheckedAnswer>;
  onCheck: (question: PracticeQuestion, response: string) => void;
}) {
  return (
    <div aria-label="Questions for this step">
      {questions.map((question) => (
        <QuestionField
          key={question.id}
          question={question}
          checked={answers[question.id]}
          onCheck={onCheck}
        />
      ))}
    </div>
  );
}
