import { describe, expect, it } from 'vitest'
import { treeNodes, treeSearch } from './treeSearch'
import type { SearchMethod } from './treeSearch'

describe('tree traversal', () => {
  it('visits depth first, from left to right', () => {
    expect(treeSearch('dfs', null).at(-1)?.visited).toEqual(['A', 'B', 'D', 'E', 'C', 'F', 'G'])
  })
  it('visits breadth first, level by level', () => {
    expect(treeSearch('bfs', null).at(-1)?.visited).toEqual(['A', 'B', 'C', 'D', 'E', 'F', 'G'])
  })
  for (const method of ['dfs', 'bfs'] as SearchMethod[]) {
    it(`${method} starts at A with an empty visit order and completes with an empty frontier`, () => {
      const steps = treeSearch(method, null)
      expect(steps[0]).toMatchObject({ current: null, visited: [], frontier: ['A'], operation: 'ready' })
      expect(steps.at(-1)).toMatchObject({ current: null, frontier: [], operation: 'complete' })
      expect(new Set(steps.at(-1)!.visited).size).toBe(treeNodes.length)
    })
    it(`${method} finds every target and stops at that node`, () => {
      for (const node of treeNodes) {
        const steps = treeSearch(method, node.id)
        expect(steps.at(-1)).toMatchObject({ current: node.id, operation: 'found' })
        expect(steps.at(-1)!.visited.at(-1)).toBe(node.id)
        expect(steps.at(-1)!.visited.filter(id => id === node.id)).toHaveLength(1)
      }
    })
    it(`${method} preserves previous snapshots and the tree`, () => {
      const original = structuredClone(treeNodes)
      const steps = treeSearch(method, null)
      expect(steps[0].visited).toEqual([])
      expect(steps[0].frontier).toEqual(['A'])
      steps.at(-1)!.visited.pop()
      expect(steps[1].visited).toEqual(['A'])
      expect(treeNodes).toEqual(original)
      expect(treeSearch(method, null).at(-1)!.visited).toHaveLength(7)
    })
  }
  it('makes the stack and queue ordering explicit after visiting A', () => {
    expect(treeSearch('dfs', null)[1].frontier).toEqual(['C', 'B'])
    expect(treeSearch('bfs', null)[1].frontier).toEqual(['B', 'C'])
  })
})
