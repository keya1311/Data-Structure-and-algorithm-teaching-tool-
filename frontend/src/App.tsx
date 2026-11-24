import { useEffect, useState } from "react";
import BinarySearchLesson from "./features/searching-algorithms/binary-search/BinarySearchLesson";
import "./App.css";

function currentPage() {
  const hash = window.location.hash;
  if (["#book-demo", "#guided-practice", "#challenge-practice"].includes(hash))
    return "binary-search";
  return hash.startsWith("#/") ? hash.slice(2) || "home" : "home";
}

function App() {
  const [page, setPage] = useState(currentPage);
  useEffect(() => {
    const navigate = () => setPage(currentPage());
    window.addEventListener("hashchange", navigate);
    return () => window.removeEventListener("hashchange", navigate);
  }, []);
  const lesson = page === "binary-search";
  return (
    <div className="application">
      <header>
        <a href="#/home">DSA learning</a>
        <nav aria-label="Main navigation">
          <a href="#/home">Home</a> ·{" "}
          <a href="#/searching">Searching algorithms</a>
        </nav>
      </header>
      <main>
        {lesson ? (
          <BinarySearchLesson />
        ) : page === "linear-search" ? (
          <article>
            <h1>Linear search</h1>
            <p>
              Linear search checks values one at a time, starting at the
              beginning, until a match is found or the list ends. Unlike binary
              search, it does not require sorted input.
            </p>
            <p>
              For example, finding 9 in [7, 3, 9, 1] means checking 7, then 3,
              then 9. That takes three comparisons. The best case is O(1), and
              the worst case is O(n).
            </p>
            <p>
              This is a written overview. Its three interactive simulations will
              be implemented after the binary-search module is validated.
            </p>
            <a href="#/binary-search">Open the complete binary-search lesson</a>
          </article>
        ) : page === "searching" ? (
          <section>
            <h1>Searching algorithms</h1>
            <p>
              Learn how to locate a value, choose between sorted and unsorted
              inputs, and reason about search boundaries and performance.
            </p>
            <ul className="module-list">
              <li>
                <h2>
                  <a href="#/binary-search">Binary search</a>
                </h2>
                <p>
                  Written explanations, an animated book demonstration, guided
                  practice and an independent challenge.
                </p>
              </li>
              <li>
                <h2>
                  <a href="#/linear-search">Linear search</a>
                </h2>
                <p>
                  Read the overview and compare its input requirements with
                  binary search. Interactive simulations are not available yet.
                </p>
              </li>
            </ul>
          </section>
        ) : (
          <section>
            <h1>Data Structures and Algorithms</h1>
            <p>
              Build your understanding through explanations, real-world examples
              and interactive practice.
            </p>
            <h2>Learning modules</h2>
            <p>
              <a href="#/searching">Open Searching Algorithms</a> — begin with
              the complete binary-search lesson.
            </p>
            <p>
              Sorting modules, data-structure modules and final assessments will
              follow as they are implemented.
            </p>
          </section>
        )}
      </main>
      <footer>
        <p>
          Learning takes practice. Pause, predict, and explain your next step.
        </p>
      </footer>
    </div>
  );
}

export default App;
