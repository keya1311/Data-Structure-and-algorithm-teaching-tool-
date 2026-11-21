export interface GraphNode {
  id: string
  x: number
  y: number
}
export interface GraphEdge {
  from: string
  to: string
  weight: number
}
export interface DijkstraStep {
  distances: Record<string, number>
  previous: Record<string, string | null>
  settled: string[]
  current: string | null
  edge: number | null
  phase: string
  explanation: string
  stageCost: string
  checks: number
}

export const graphNodes: GraphNode[] = [
  { id: 'A', x: 70, y: 200 }, { id: 'B', x: 260, y: 70 },
  { id: 'C', x: 260, y: 330 }, { id: 'D', x: 470, y: 70 },
  { id: 'E', x: 470, y: 330 }, { id: 'F', x: 660, y: 200 },
]
export const graphEdges: GraphEdge[] = [
  { from: 'A', to: 'B', weight: 4 }, { from: 'A', to: 'C', weight: 2 },
  { from: 'B', to: 'C', weight: 1 }, { from: 'B', to: 'D', weight: 5 },
  { from: 'C', to: 'D', weight: 8 }, { from: 'C', to: 'E', weight: 10 },
  { from: 'D', to: 'E', weight: 2 }, { from: 'D', to: 'F', weight: 6 },
  { from: 'E', to: 'F', weight: 3 },
]

export function dijkstra(nodes: GraphNode[], edges: GraphEdge[], source: string, target: string | null): DijkstraStep[] {
  const ids = nodes.map(node => node.id)
  if (!ids.length || new Set(ids).size !== ids.length || ids.some(id => !id)) throw new Error('Graph nodes must have unique, non-empty ids.')
  if (!ids.includes(source) || (target !== null && !ids.includes(target))) throw new Error('Choose an existing start and target node.')
  if (edges.some(edge => !ids.includes(edge.from) || !ids.includes(edge.to) || !Number.isFinite(edge.weight) || edge.weight < 0)) throw new Error('Dijkstra requires finite, non-negative weights and existing edge endpoints.')
  const adjacency = new Map(ids.map(id => [id, [] as { neighbor: string; weight: number; index: number }[]]))
  edges.forEach((edge, index) => {
    adjacency.get(edge.from)!.push({ neighbor: edge.to, weight: edge.weight, index })
    adjacency.get(edge.to)!.push({ neighbor: edge.from, weight: edge.weight, index })
  })
  const distances: Record<string, number> = Object.fromEntries(ids.map(id => [id, Infinity]))
  const previous: Record<string, string | null> = Object.fromEntries(ids.map(id => [id, null]))
  const settled = new Set<string>()
  const steps: DijkstraStep[] = []
  let checks = 0
  distances[source] = 0
  const record = (phase: string, explanation: string, current: string | null, edge: number | null, stageCost: string) => {
    steps.push({ distances: { ...distances }, previous: { ...previous }, settled: [...settled], current, edge, phase, explanation, stageCost, checks })
  }
  record('Ready', `${source} starts at distance 0. Other distances are unknown (∞). Edges are undirected and all weights are non-negative.`, null, null, 'O(V + E) distance and adjacency setup after input validation')
  while (settled.size < ids.length) {
    let current: string | null = null
    let best = Infinity
    for (const id of ids) {
      if (!settled.has(id) && distances[id] < best) {
        current = id
        best = distances[id]
      }
    }
    if (current === null) break
    settled.add(current)
    record('Settle nearest node', `${current} has the smallest unsettled distance, ${best}. Its shortest distance is now final.`, current, null, 'O(V) scan of all nodes to select the nearest; O(1) to mark it settled')
    if (current === target) {
      record('Shortest path found', `The shortest distance from ${source} to ${target} is ${best}. Stop once the target is settled, not merely discovered.`, current, null, 'O(1) target check; reconstructing a path takes O(V) in the worst case')
      return steps
    }
    for (const { neighbor, weight, index } of adjacency.get(current)!) {
      if (settled.has(neighbor)) continue
      checks += 1
      const candidate = best + weight
      if (candidate < distances[neighbor]) {
        const old = distances[neighbor]
        distances[neighbor] = candidate
        previous[neighbor] = current
        record('Relax edge', `Through ${current}, distance to ${neighbor} becomes ${candidate} (${best} + ${weight}), improving ${old === Infinity ? '∞' : old}. This distance is tentative until settled.`, current, index, 'O(1) distance comparison and update for one adjacency entry')
      } else {
        record('Keep shorter route', `Through ${current}, ${neighbor} would cost ${candidate}; keep the existing distance ${distances[neighbor]}.`, current, index, 'O(1) distance comparison for one adjacency entry')
      }
    }
  }
  const unreachable = ids.filter(id => !settled.has(id))
  record(target ? 'No path' : 'Complete', target ? `No path from ${source} to ${target}.` : `All reachable distances are final.${unreachable.length ? ` Unreachable: ${unreachable.join(', ')}.` : ''}`, null, null, 'O(V) final reachability scan; there is no finite unsettled distance left')
  return steps
}

export function shortestPath(step: DijkstraStep, source: string, target: string): string[] {
  if (!step.settled.includes(target)) return []
  const path: string[] = []
  let node: string | null = target
  while (node !== null) {
    path.push(node)
    if (node === source) return path.reverse()
    node = step.previous[node] ?? null
  }
  return []
}
