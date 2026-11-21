import { useState } from 'react'
import { dijkstra, graphEdges, graphNodes, shortestPath } from './dijkstra'
import './DijkstraLesson.css'

export default function DijkstraLesson() {
  const [source, setSource] = useState('A')
  const [target, setTarget] = useState('F')
  const [position, setPosition] = useState(0)
  const steps = dijkstra(graphNodes, graphEdges, source, target || null)
  const step = steps[position]
  const path = target ? shortestPath(step, source, target) : []
  const pending = graphNodes.filter(node => !step.settled.includes(node.id) && Number.isFinite(step.distances[node.id])).sort((a, b) => step.distances[a.id] - step.distances[b.id])

  return (
    <section className="feature dijkstra-lesson" id="dijkstra" aria-labelledby="dijkstra-title">
      <div className="feature-heading"><span>04 — WEIGHTED GRAPHS</span><span>Follow the cheapest route.</span></div>
      <h2 id="dijkstra-title">Dijkstra’s algorithm.</h2>
      <p>Find shortest paths in an undirected graph with non-negative edge weights. An edge label is its cost, not its drawing length. A discovered distance stays tentative until its node is settled.</p>
      <div className="graph-toolbar">
        <label htmlFor="graph-source">Start node<select id="graph-source" value={source} onChange={event => { setSource(event.target.value); setPosition(0) }}>{graphNodes.map(node => <option key={node.id}>{node.id}</option>)}</select></label>
        <label htmlFor="graph-target">Shortest path target<select id="graph-target" value={target} onChange={event => { setTarget(event.target.value); setPosition(0) }}><option value="">All distances</option>{graphNodes.map(node => <option key={node.id}>{node.id}</option>)}</select></label>
      </div>
      <div className="graph-workspace">
        <div className="weighted-graph">
          <div className="visual-heading"><span>UNDIRECTED · NON-NEGATIVE WEIGHTS</span><span>{step.checks} EDGE CHECKS</span></div>
          <div className="graph-scroll" tabIndex={0} role="region" aria-label="Weighted graph, scroll horizontally on small screens">
            <svg viewBox="0 0 740 410" role="img" aria-labelledby="graph-svg-title graph-svg-desc">
              <title id="graph-svg-title">Weighted graph with six nodes</title>
              <desc id="graph-svg-desc">Current: {step.current ?? 'none'}. Settled: {step.settled.join(', ') || 'none'}. Connections and costs are also listed below the graph.</desc>
              {graphEdges.map((edge, index) => {
                const from = graphNodes.find(node => node.id === edge.from)!
                const to = graphNodes.find(node => node.id === edge.to)!
                const onPath = path.some((id, i) => i > 0 && ((path[i - 1] === edge.from && id === edge.to) || (path[i - 1] === edge.to && id === edge.from)))
                return <g key={index} className={`weighted-edge${onPath ? ' shortest-edge' : step.edge === index ? ' active-edge' : ''}`}><line x1={from.x} y1={from.y} x2={to.x} y2={to.y} /><rect x={(from.x + to.x) / 2 - 14} y={(from.y + to.y) / 2 - 13} width="28" height="26" rx="6" /><text x={(from.x + to.x) / 2} y={(from.y + to.y) / 2 + 5} textAnchor="middle">{edge.weight}</text></g>
              })}
              {graphNodes.map(node => <g key={node.id} transform={`translate(${node.x} ${node.y})`} className={`weighted-node${step.current === node.id ? ' graph-current' : step.settled.includes(node.id) ? ' graph-settled' : ''}`}><circle r="29" /><text textAnchor="middle" dy="7">{node.id}</text><text className="distance-label" textAnchor="middle" y="49">d = {Number.isFinite(step.distances[node.id]) ? step.distances[node.id] : '∞'}</text></g>)}
            </svg>
          </div>
          <div className="visual-legend"><span>◎ Current</span><span>● Settled distance</span><span>Orange edge: checking</span><span>Green path: final</span></div>
          <details><summary>Connections and edge costs</summary><ul className="edge-list">{graphEdges.map((edge, index) => <li key={index}>{edge.from} ↔ {edge.to}: {edge.weight}</li>)}</ul></details>
        </div>
        <div className="distance-panel">
          <h3>Distance from {source}</h3>
          <table><caption>Shortest-distance estimates</caption><thead><tr><th>Node</th><th>Cost</th><th>State</th></tr></thead><tbody>{graphNodes.map(node => <tr key={node.id}><th scope="row">{node.id}</th><td>{Number.isFinite(step.distances[node.id]) ? step.distances[node.id] : '∞'}</td><td>{step.settled.includes(node.id) ? 'Final' : 'Tentative'}</td></tr>)}</tbody></table>
          <h3>Unsettled, nearest first</h3><p>{pending.map(node => `${node.id} (${step.distances[node.id]})`).join(' → ') || 'No finite candidates'}</p>
          <h3>Final path</h3><p className="final-path">{path.length ? path.join(' → ') : target ? 'Available after the target is settled.' : 'Choose a target to display its final path.'}</p>
        </div>
      </div>
      <div className="graph-status" role="status" aria-live="polite" aria-atomic="true"><strong>Step {position + 1} of {steps.length} · {step.phase}</strong><p>{step.explanation}</p></div>
      <div className="step-controls graph-controls"><button type="button" disabled={position === 0} onClick={() => setPosition(current => current - 1)}>Previous graph step</button><button type="button" disabled={position === steps.length - 1} onClick={() => setPosition(current => current + 1)}>Next graph step</button><button type="button" onClick={() => setPosition(0)}>Reset shortest path</button></div>
      <div className="complexity-panel" aria-label="Dijkstra complexity"><article><h3>Current stage</h3><p>{step.stageCost}</p></article><article><h3>This implementation</h3><p>O(V² + E) search time; O(V + E) auxiliary space with adjacency lists and a linear scan for the next node. A binary heap can give O((V + E) log V), but this implementation does not use a heap.</p></article><article><h3>Recording overhead</h3><p>V is the number of nodes and E is the number of edges. Each snapshot copies O(V) state. Input validation uses linear endpoint lookups (up to O(VE)); trace recording and rendering add work beyond the search bound.</p></article></div>
    </section>
  )
}
