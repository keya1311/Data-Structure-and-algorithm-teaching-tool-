import BinarySearchLesson from './features/binary-search/BinarySearchLesson'
import TreeSearchLesson from './features/tree-search/TreeSearchLesson'
import ArrayAlgorithmLesson from './features/array-algorithms/ArrayAlgorithmLesson'
import DijkstraLesson from './features/dijkstra/DijkstraLesson'
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
          <BinarySearchLesson />
          <div className="feature-description"><h2 id="binary-title">Less searching.<br />More understanding.</h2><div><p>Binary search uses sorted order to narrow the possibilities. Compare the middle value, choose a side, and repeat.</p><p className="prototype-note">Interactive lesson · Move through each decision at your own pace.</p></div></div>
        </section>
        <TreeSearchLesson />
        <ArrayAlgorithmLesson />
        <DijkstraLesson />
        <section className="concepts" id="topics" aria-labelledby="topics-title">
          <div className="section-heading"><h2 id="topics-title">The concepts.</h2><span>A small collection. Built step by step.</span></div>
          <div className="concept-grid">
            <article><div className="concept-art search-thumbnail" role="img" aria-label="Numbered array with its middle value marked"><span>02</span><span>05</span><span className="selected">08</span><span>12</span><span>16</span></div><div className="concept-label"><h3>Binary search</h3><span>Interactive lesson</span></div><a href="#binary-search">Try the interactive lesson →</a></article>
            <article><div className="concept-art sort-thumbnail" role="img" aria-label="Bars of different heights representing unsorted values"><i /><i /><i /><i /><i /></div><div className="concept-label"><h3>Searching & sorting</h3><span>6 algorithms</span></div><a href="#array-lab">Try linear search and five sorting methods →</a></article>
            <article><div className="concept-art tree-thumbnail" role="img" aria-label="A rooted tree with two branches"><span>A</span><div><span>B</span><span>C</span></div></div><div className="concept-label"><h3>Tree search</h3><span>DFS + BFS</span></div><a href="#tree-search">Explore depth and breadth →</a></article>
            <article><div className="concept-art graph-thumbnail" role="img" aria-label="A weighted route from A through B to C"><span>A</span><small>2</small><span>B</span><small>3</small><span>C</span></div><div className="concept-label"><h3>Dijkstra’s algorithm</h3><span>Shortest paths</span></div><a href="#dijkstra">Explore a weighted graph →</a></article>
          </div>
        </section>
        <footer><span>Data structures & algorithms</span><span>A learning platform in development.</span><a href="#page-title">Back to top ↑</a></footer>
      </main>
    </div>
  )
}

export default App
