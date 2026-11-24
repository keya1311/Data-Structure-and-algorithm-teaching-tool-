import BookDemo from "./BookDemo";
import PracticeSimulation from "./PracticeSimulation";

export default function BinarySearchLesson() {
  return (
    <article aria-labelledby="binary-title">
      <h1 id="binary-title" tabIndex={-1}>
        Binary search
      </h1>
      <p>
        Searching Algorithms · Three simulations, from watching to reasoning
        independently.
      </p>
      <nav aria-label="Binary search lesson sections">
        <a href="#book-demo">1. Book demonstration</a> ·{" "}
        <a href="#guided-practice">2. Guided practice</a> ·{" "}
        <a href="#challenge-practice">3. Independent challenge</a>
      </nav>
      <section aria-labelledby="what-is-binary">
        <h2 id="what-is-binary">What is binary search?</h2>
        <p>
          Binary search finds a target by repeatedly halving a sorted range.
          Compare the target with the middle value. If they differ, the sorted
          order tells you which half cannot contain the target. Keep the other
          half and repeat.
        </p>
        <p>
          The useful rule is: if the target exists, it must remain between the
          low and high boundaries. You never discard a value that could still be
          the answer.
        </p>
      </section>
      <BookDemo />
      <section aria-labelledby="book-to-array">
        <h2 id="book-to-array">From pages to array indexes</h2>
        <p>
          The book’s page numbers start at 1. Array indexes start at 0. In an
          array with five values, low begins at 0 and high begins at 4.
        </p>
        <p>
          Calculate the lower midpoint as{" "}
          <code>low + floor((high − low) / 2)</code>. A greater target moves low
          to <code>mid + 1</code>; a smaller target moves high to{" "}
          <code>mid − 1</code>. The midpoint itself is excluded because its
          value has already been checked.
        </p>
        <p>
          Try applying those decisions yourself. You will be asked to enter
          indexes, which may be different from the values stored at those
          indexes.
        </p>
      </section>
      <PracticeSimulation mode="guided" />
      <section aria-labelledby="search-limits">
        <h2 id="search-limits">When does the search stop?</h2>
        <p>
          Equality means a match has been found. If low becomes greater than
          high, the interval is empty and the target is absent. With duplicate
          values, this algorithm finds a match; it does not promise the first or
          last one.
        </p>
        <p>
          Binary search requires sorted input. On an unsorted list, linear
          search can check values in sequence without that prerequisite. Sorting
          first also has a cost, so the best choice depends on the task.
        </p>
        <p>
          Each search round roughly halves the candidates: 16 → 8 → 4 → 2 → 1.
          The search makes O(log n) comparisons in the worst case and O(1) when
          the first midpoint matches. The iterative search itself uses O(1)
          auxiliary space.
        </p>
        <p>
          This teaching implementation also checks input order in O(n) and
          records O(log n) step objects for replay. Those costs are additional
          to the standard search bound.
        </p>
      </section>
      <PracticeSimulation mode="challenge" />
      <section aria-labelledby="lesson-summary">
        <h2 id="lesson-summary">What you should now be able to explain</h2>
        <ul>
          <li>Why sorted order makes discarding half safe.</li>
          <li>How indexes differ from values and page numbers.</li>
          <li>
            How low, high and mid change without keeping the old midpoint.
          </li>
          <li>Why an empty interval means “not found”.</li>
        </ul>
        <p>
          These practice activities are not graded final assessments. Immediate
          quizzes, seven-day revision and saved progress will be added in later
          development steps.
        </p>
      </section>
    </article>
  );
}
