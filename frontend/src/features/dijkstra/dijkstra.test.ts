import { describe, expect, it } from 'vitest'
import { dijkstra, graphEdges, graphNodes, shortestPath } from './dijkstra'

describe('Dijkstra shortest paths', () => {
  it('calculates all shortest distances and a path on the example graph', () => {
    const final = dijkstra(graphNodes, graphEdges, 'A', null).at(-1)!
    expect(final.distances).toEqual({ A: 0, B: 3, C: 2, D: 8, E: 10, F: 13 })
    expect(shortestPath(final, 'A', 'F')).toEqual(['A', 'C', 'B', 'D', 'E', 'F'])
  })
  it('improves a tentative distance before settling it', () => {
    const steps = dijkstra(graphNodes, graphEdges, 'A', 'B')
    expect(steps.some(step => step.distances.B === 4 && !step.settled.includes('B'))).toBe(true)
    expect(steps.at(-1)).toMatchObject({ phase: 'Shortest path found', distances: { B: 3 } })
  })
  it('matches an independent all-pairs reference for every source and target', () => {
    const ids = graphNodes.map(node => node.id)
    const distances = ids.map((from, i) => ids.map((to, j) => i === j ? 0 : graphEdges.find(edge => (edge.from === from && edge.to === to) || (edge.from === to && edge.to === from))?.weight ?? Infinity))
    for (let k = 0; k < ids.length; k += 1) {
      for (let i = 0; i < ids.length; i += 1) {
        for (let j = 0; j < ids.length; j += 1) distances[i][j] = Math.min(distances[i][j], distances[i][k] + distances[k][j])
      }
    }
    for (const [i, source] of ids.entries()) {
      for (const [j, target] of ids.entries()) {
        const final = dijkstra(graphNodes, graphEdges, source, target).at(-1)!
        expect(final.distances[target]).toBe(distances[i][j])
        const path = shortestPath(final, source, target)
        expect(path[0]).toBe(source)
        expect(path.at(-1)).toBe(target)
        let cost = 0
        for (let index = 1; index < path.length; index += 1) {
          cost += graphEdges.find(edge => (edge.from === path[index - 1] && edge.to === path[index]) || (edge.to === path[index - 1] && edge.from === path[index]))!.weight
        }
        expect(cost).toBe(distances[i][j])
      }
    }
  })
  it('handles unreachable nodes and returns no unproven path', () => {
    const final = dijkstra(graphNodes, [], 'A', 'F').at(-1)!
    expect(final.phase).toBe('No path')
    expect(final.distances.F).toBe(Infinity)
    expect(shortestPath(final, 'A', 'F')).toEqual([])
    expect(dijkstra(graphNodes, [], 'A', null).at(-1)!.phase).toBe('Complete')
  })
  it('handles a source target, zero weights and repeated edges', () => {
    expect(dijkstra(graphNodes, graphEdges, 'A', 'A').at(-1)!.distances.A).toBe(0)
    const edges = [{ from: 'A', to: 'B', weight: 8 }, { from: 'A', to: 'B', weight: 0 }]
    expect(dijkstra(graphNodes, edges, 'A', 'B').at(-1)!.distances.B).toBe(0)
  })
  it('rejects invalid nodes, endpoints and negative or non-finite weights', () => {
    expect(() => dijkstra([], [], 'A', null)).toThrow()
    expect(() => dijkstra([graphNodes[0], graphNodes[0]], [], 'A', null)).toThrow()
    expect(() => dijkstra(graphNodes, [], 'Z', null)).toThrow()
    for (const weight of [-1, Infinity, NaN]) expect(() => dijkstra(graphNodes, [{ from: 'A', to: 'B', weight }], 'A', null)).toThrow()
    expect(() => dijkstra(graphNodes, [{ from: 'A', to: 'Z', weight: 1 }], 'A', null)).toThrow()
  })
  it('preserves snapshots and input data', () => {
    const nodes = structuredClone(graphNodes)
    const edges = structuredClone(graphEdges)
    const steps = dijkstra(nodes, edges, 'A', null)
    expect(steps[0].distances.F).toBe(Infinity)
    steps.at(-1)!.distances.A = 99
    expect(steps[0].distances.A).toBe(0)
    expect(nodes).toEqual(graphNodes)
    expect(edges).toEqual(graphEdges)
  })
})
