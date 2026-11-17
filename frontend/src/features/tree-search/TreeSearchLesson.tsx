import { useState } from 'react'
import { treeNodes, treeSearch } from './treeSearch'
import type { SearchMethod, TreeNodeId } from './treeSearch'
import './TreeSearchLesson.css'

export default function TreeSearchLesson() {
  const [method, setMethod] = useState<SearchMethod>('dfs')
  const [target, setTarget] = useState<TreeNodeId | ''>('')
  const [position, setPosition] = useState(0)
  const steps = treeSearch(method, target || null)
  const step = steps[position]
  const pending = method === 'dfs' ? [...step.frontier].reverse() : step.frontier
  const methodName = method === 'dfs' ? 'Depth-first search' : 'Breadth-first search'

  return (
    <section className="feature tree-lesson" id="tree-search" aria-labelledby="tree-title">
      <div className="feature-heading"><span>02 — EXPLORE A TREE</span><span>One tree. Two ways through.</span></div>
      <div className="tree-intro"><div><p className="lesson-kicker">FOLLOW THE CONNECTIONS</p><h2 id="tree-title">Go deeper.<br />Or go wider.</h2></div><p>Depth-first search explores a branch before returning to its siblings. Breadth-first search explores each level before moving deeper. Follow both on the same tree, starting at A.</p></div>
      <div className="tree-toolbar">
        <label htmlFor="tree-method">Search method
          <select id="tree-method" value={method} onChange={event => { setMethod(event.target.value as SearchMethod); setPosition(0) }}>
            <option value="dfs">Depth-first search (DFS)</option>
            <option value="bfs">Breadth-first search (BFS)</option>
          </select>
        </label>
        <label htmlFor="tree-target">Find a node
          <select id="tree-target" value={target} onChange={event => { setTarget(event.target.value as TreeNodeId | ''); setPosition(0) }}>
            <option value="">Visit all nodes</option>
            {treeNodes.map(node => <option key={node.id} value={node.id}>{node.id}</option>)}
          </select>
        </label>
        <span className="tree-mode-note">{method === 'dfs' ? 'STACK · LAST IN, FIRST OUT' : 'QUEUE · FIRST IN, FIRST OUT'}</span>
      </div>
      <div className="tree-workspace">
        <div className="tree-canvas">
          <div className="visual-heading"><span>{methodName}</span><span>{target ? `TARGET ${target}` : 'FULL TRAVERSAL'}</span></div>
          <div className="tree-diagram" tabIndex={0} role="region" aria-label="Tree diagram, scroll horizontally on small screens">
          <svg viewBox="0 0 720 390" role="img" aria-labelledby="tree-svg-title tree-svg-description">
            <title id="tree-svg-title">Search tree rooted at A</title>
            <desc id="tree-svg-description">A connects to B and C. B connects to D and E. C connects to F and G. Current node: {step.current ?? 'none'}. Visited: {step.visited.join(', ') || 'none'}.</desc>
            {treeNodes.flatMap(parent => parent.children.map(childId => {
              const child = treeNodes.find(node => node.id === childId)!
              return <line key={childId} x1={parent.x} y1={parent.y} x2={child.x} y2={child.y} className={step.visited.includes(childId) ? 'tree-edge traversed' : 'tree-edge'} />
            }))}
            {treeNodes.map(node => {
              const isCurrent = step.current === node.id
              const isVisited = step.visited.includes(node.id)
              const isPending = step.frontier.includes(node.id)
              const isFound = isCurrent && step.operation === 'found'
              const state = isFound ? 'found' : isCurrent ? 'current' : isVisited ? 'visited' : isPending ? 'pending' : 'unseen'
              const order = step.visited.indexOf(node.id) + 1
              return (
                <g key={node.id} className={`tree-node ${state}`} transform={`translate(${node.x} ${node.y})`}>
                  <circle r="32" /><text textAnchor="middle" dy="8">{node.id}</text>
                  <text className="tree-node-caption" textAnchor="middle" y="51">{isFound ? 'FOUND' : isCurrent ? 'CURRENT' : isVisited ? `VISIT ${order}` : isPending ? 'WAITING' : ''}</text>
                </g>
              )
            })}
          </svg>
          </div>
          <div className="visual-legend"><span>◎ Current</span><span>● Visited</span><span>○ Waiting</span><span>✓ Found</span></div>
        </div>
        <aside className="tree-inspector" aria-label="Traversal state">
          <div className="inspector-heading"><span>{method === 'dfs' ? 'THE STACK' : 'THE QUEUE'}</span><span>{pending.length} waiting</span></div>
          <p className="frontier-help">{method === 'dfs' ? 'Top of stack first → next to visit' : 'Front of queue first → next to visit'}</p>
          <ol className="frontier-list" aria-label="Nodes waiting, next first">{pending.map((node, index) => <li key={node}><strong>{node}</strong><span>{index === 0 ? 'NEXT' : 'WAITING'}</span></li>)}</ol>
          {pending.length === 0 && <p className="empty-frontier">Empty — no nodes waiting.</p>}
          <h3>Visit order</h3>
          <ol className="visit-order" aria-label="Tree visit order">{step.visited.map(node => <li key={node}>{node}</li>)}</ol>
          {step.visited.length === 0 && <p>No nodes visited yet.</p>}
          <p className="visit-count">{step.visited.length} / {treeNodes.length} visited</p>
        </aside>
      </div>
      <div className="tree-status step-explanation" role="status" aria-live="polite" aria-atomic="true"><strong>Step {position + 1} of {steps.length} · {step.operation}</strong><p>{step.explanation}</p></div>
      <div className="step-controls tree-controls">
        <button type="button" disabled={position === 0} onClick={() => setPosition(current => current - 1)}>Previous tree step</button>
        <button type="button" disabled={position === steps.length - 1} onClick={() => setPosition(current => current + 1)}>Next tree step</button>
        <button type="button" onClick={() => setPosition(0)}>Reset traversal</button>
      </div>
      <div className="tree-learning"><article><h3>Why a stack for DFS?</h3><p>The most recently added node is explored first. We push the right child before the left child, so this demonstration visits the left branch first. DFS order: A → B → D → E → C → F → G.</p></article><article><h3>Why a queue for BFS?</h3><p>Nodes wait in arrival order. Children join at the back, so all nodes at one depth are visited before the next level. BFS order: A → B → C → D → E → F → G.</p></article><article><h3>Tree or graph?</h3><p>This is a fixed, rooted tree: each non-root node has one parent and there are no cycles. A general graph search also needs to track discovered nodes to avoid revisits. Both standard traversals take O(n) on a tree with suitable data structures. This small teaching tool uses array operations and copies each step for replay, so its total overhead can grow quadratically.</p></article></div>
    </section>
  )
}
