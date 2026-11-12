import SiteHeader from './components/SiteHeader'
import './App.css'

function App() {
  return (
    <div className="app-shell">
      <div className="announcement">Data structures & algorithms <span aria-hidden="true">→</span> Explore one step at a time.</div>
      <SiteHeader />
      <main id="main-content">
        <section className="intro" aria-labelledby="page-title">
          <div className="intro-meta"><span className="edition">01 / SEARCHING</span><a href="#topics">Explore the concepts ↓</a></div>
          <p className="intro-caption">A closer look at how things work.</p>
          <h1 id="page-title">ALGORITHMS<br /><span>IN MOTION.</span></h1>
          <p className="intro-description">Follow the logic. Question the next move.<br />Understand what happens between input and answer.</p>
          <a className="outline-link" href="#binary-search">Discover binary search <span aria-hidden="true">↓</span></a>
        </section>
        <section className="feature" id="binary-search" aria-labelledby="binary-title">
          <div className="feature-heading"><span>01 — THE SEARCH</span><span>Sorted data. Fewer possibilities.</span></div>
          <div className="search-art" role="img" aria-label="Binary search example: target 12. Compare midpoint 8, then exclude 2, 5 and 8. The remaining candidates are 12 and 16.">
            <div className="art-heading"><span>BINARY / SEARCH</span><span className="target-label">TARGET: 12</span></div>
            <div className="array-picture" aria-hidden="true">
              {[2, 5, 8, 12, 16].map((value, index) => (
                <div className={`array-cell cell-${index}`} key={value}>
                  <span className="cell-index">0{index}</span><strong>{value}</strong>
                  <span className="cell-note">{index === 2 ? 'MIDPOINT' : index === 3 ? 'CANDIDATE' : ' '}</span>
                </div>
              ))}
            </div>
            <div className="art-caption"><span>12 &gt; 8</span><p>Look right.<br />Keep only what could contain the answer.</p><span aria-hidden="true">→</span></div>
          </div>
          <div className="feature-description"><h2 id="binary-title">Less searching.<br />More understanding.</h2><div><p>Binary search uses sorted order to narrow the possibilities. Compare the middle value, choose a side, and repeat.</p><p className="prototype-note">Illustrated preview · Interactive controls are in development.</p></div></div>
        </section>
        <section className="concepts" id="topics" aria-labelledby="topics-title">
          <div className="section-heading"><h2 id="topics-title">The concepts.</h2><span>A small collection. Built step by step.</span></div>
          <div className="concept-grid">
            <article><div className="concept-art search-thumbnail" role="img" aria-label="Numbered array with its middle value marked"><span>02</span><span>05</span><span className="selected">08</span><span>12</span><span>16</span></div><div className="concept-label"><h3>Binary search</h3><span>Engine tested</span></div><a href="#binary-search">View illustrated preview →</a></article>
            <article><div className="concept-art sort-thumbnail" role="img" aria-label="Bars of different heights representing unsorted values"><i /><i /><i /><i /><i /></div><div className="concept-label"><h3>Sorting</h3><span>Coming later</span></div><p>Compare, move, put things in order.</p></article>
            <article><div className="concept-art stack-thumbnail" role="img" aria-label="Three stacked blocks representing a stack data structure"><span>03</span><span>02</span><span>01</span></div><div className="concept-label"><h3>Data structures</h3><span>Coming later</span></div><p>Explore how we organise information.</p></article>
          </div>
        </section>
        <footer><span>Data structures & algorithms</span><span>A learning platform in development.</span><a href="#page-title">Back to top ↑</a></footer>
      </main>
    </div>
  )
}

export default App
