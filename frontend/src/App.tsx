import SiteHeader from './components/SiteHeader'
import './App.css'

function App() {
  return (
    <div className="app-shell">
      <SiteHeader />

      <main>
        <section className="hero-section">
          <p className="eyebrow">Learn by doing</p>
          <h1>Learn algorithms with confidence.</h1>
          <p className="hero-copy">
            Explore algorithms through explanations, visualisations, and
            practical activities that help you understand each step.
          </p>
          <a className="primary-button" href="#topics">
            Start learning
          </a>
        </section>

        <section className="content-section" id="topics">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Your learning path</p>
              <h2>Start with a core concept</h2>
            </div>
            <span className="section-count">1 topic available</span>
          </div>

          <article className="topic-card">
            <div className="topic-number" aria-hidden="true">
              01
            </div>
            <div className="topic-content">
              <p className="card-kicker">Searching algorithms</p>
              <h3>Binary search</h3>
              <p>
                Learn how sorted data helps you find an item efficiently by
                eliminating half of the remaining possibilities each time.
              </p>
              <button className="text-button" type="button">
                Begin lesson <span aria-hidden="true">→</span>
              </button>
            </div>
          </article>
        </section>

        <section className="content-section" id="progress">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Your progress</p>
              <h2>Keep moving forward</h2>
            </div>
          </div>

          <div className="progress-card">
            <div className="progress-card-top">
              <span>Binary search learning path</span>
              <strong>Not started</strong>
            </div>
            <div
              className="progress-track"
              role="progressbar"
              aria-label="Binary search learning path progress"
              aria-valuenow={0}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <span />
            </div>
            <p>Your completed lessons and quiz results will appear here.</p>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
