import { useState } from "react";
import SimulationPlayer from "../../../components/simulation/SimulationPlayer";
import { bookEntries, bookExplanation, createBookTrace } from "./bookExample";
import "./BookDemo.css";

export default function BookDemo() {
  const [target, setTarget] = useState("Recursion");
  const steps = createBookTrace(target);
  return (
    <section aria-labelledby="book-heading" id="book-demo">
      <h2 id="book-heading">Simulation 1 · Watch a book search</h2>
      <p>
        Imagine looking for a word in a dictionary. You would not read every
        page: open near the middle, compare alphabetically, then keep only the
        earlier or later pages.
      </p>
      <p>
        This miniature glossary has one entry per page to make the idea visible.
        It works because the entries are alphabetical; an ordinary story book
        would not have this property.
      </p>
      <label htmlFor="book-word">
        Word to find{" "}
        <select
          id="book-word"
          value={target}
          onChange={(event) => setTarget(event.target.value)}
        >
          {bookEntries.map((entry) => (
            <option key={entry.word}>{entry.word}</option> //You turn each of the words to a glossary object.
          ))}
          <option value="Zebra">Zebra (not in this glossary)</option>
        </select>
      </label>
      <p>
        The demonstration starts automatically unless your device requests
        reduced motion. Pause or change the speed whenever you need.
      </p>
      <SimulationPlayer
        key={target}
        id="book"
        automatic
        stepCount={steps.length}
      >
        {(position) => {
          const step = steps[position];
          const opened =
            steps.slice(0, position + 1).findLast((item) => item.mid !== null)
              ?.mid ?? undefined;
          const entry = opened === undefined ? null : bookEntries[opened];
          return (
            <>
              <figure
                className="book-stage"
                aria-label="Animated alphabetical glossary"
              >
                <div className="book-open">
                  <div className="book-page book-left">
                    <p className="book-eyebrow">THE ALGORITHM GLOSSARY</p>
                    <h3>
                      Find a word.
                      <br />
                      Skip half the pages.
                    </h3>
                    <p className="book-target">
                      Looking for <strong>{target}</strong>
                    </p>
                    <p>
                      {step.low <= step.high
                        ? `Remaining pages: ${step.low + 1}–${step.high + 1}`
                        : "No candidate pages remain."}
                    </p>
                    {step.low <= step.high && (
                      <p className="book-range">
                        {bookEntries[step.low].word}
                        <br />
                        <span>through</span>
                        <br />
                        {bookEntries[step.high].word}
                      </p>
                    )}
                    <span className="book-footer">
                      A miniature alphabetical glossary
                    </span>
                  </div>
                  <div
                    className={`book-page book-right${step.operation === "found" ? " book-found" : ""}`}
                  >
                    <p className="book-eyebrow">
                      {entry ? "CURRENT ENTRY" : "OPEN THE MIDDLE"}
                    </p>
                    <h3>{entry?.word ?? "A–Z"}</h3>
                    <p>
                      {entry?.definition ??
                        "Start with every page, then narrow the search using alphabetical order."}
                    </p>
                    <div className="book-print-lines" aria-hidden="true">
                      <i />
                      <i />
                      <i />
                      <i />
                      <i />
                    </div>
                    <span className="book-page-number">
                      {opened === undefined
                        ? "—"
                        : String(opened + 1).padStart(2, "0")}
                    </span>
                    {opened !== undefined && (
                      <div
                        className="turning-page"
                        key={`${target}-${opened}`}
                        aria-hidden="true"
                      />
                    )}
                  </div>
                </div>
                <figcaption>
                  {opened === undefined
                    ? "The book is ready. Watch which page is opened first."
                    : `Open at page ${opened + 1}: ${entry!.word}.`}
                </figcaption>
              </figure>
              <ol className="book-page-strip" aria-label="Candidate pages">
                {bookEntries.map((item, index) => (
                  <li
                    key={item.word}
                    className={
                      index < step.low || index > step.high
                        ? "discarded-page"
                        : opened === index
                          ? "opened-page"
                          : ""
                    }
                  >
                    <span>{index + 1}</span>
                    <small>
                      {index < step.low || index > step.high ? "Out" : "In"}
                    </small>
                  </li>
                ))}
              </ol>
              <div
                className="step-message"
                role="status"
                aria-live="polite"
                aria-atomic="true"
              >
                <strong>
                  {step.operation === "found"
                    ? "Word found"
                    : step.operation === "not-found"
                      ? "Word not found"
                      : "Follow the page search"}
                </strong>
                <p>{bookExplanation(step, target)}</p>
              </div>
            </>
          );
        }}
      </SimulationPlayer>
    </section>
  );
}
