export type SearchMethod = 'dfs' | 'bfs'
export type TreeNodeId = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G'
export interface TreeNode {
  id: TreeNodeId
  children: TreeNodeId[]
  x: number
  y: number
}

export const treeNodes: TreeNode[] = [
  { id: 'A', children: ['B', 'C'], x: 360, y: 60 },
  { id: 'B', children: ['D', 'E'], x: 200, y: 190 },
  { id: 'C', children: ['F', 'G'], x: 520, y: 190 },
  { id: 'D', children: [], x: 100, y: 320 },
  { id: 'E', children: [], x: 280, y: 320 },
  { id: 'F', children: [], x: 440, y: 320 },
  { id: 'G', children: [], x: 620, y: 320 },
]

export interface TreeSearchStep {
  current: TreeNodeId | null
  visited: TreeNodeId[]
  frontier: TreeNodeId[]
  operation: 'ready' | 'visit' | 'found' | 'complete'
  explanation: string
}

export function treeSearch(method: SearchMethod, target: TreeNodeId | null): TreeSearchStep[] {
  const frontier: TreeNodeId[] = ['A']
  const visited: TreeNodeId[] = []
  const steps: TreeSearchStep[] = [{
    current: null, visited: [], frontier: ['A'], operation: 'ready',
    explanation: `Start at root A. ${method === 'dfs' ? 'Use a stack: the last node added is visited next.' : 'Use a queue: the first node added is visited next.'}`,
  }]
  while (frontier.length > 0) {
    const current = method === 'dfs' ? frontier.pop()! : frontier.shift()!
    visited.push(current)
    if (current === target) {
      steps.push({ current, visited: [...visited], frontier: [...frontier], operation: 'found', explanation: `Found ${target} after visiting ${visited.length} ${visited.length === 1 ? 'node' : 'nodes'}. Stop the search.` })
      return steps
    }
    const children = treeNodes.find(node => node.id === current)!.children
    frontier.push(...(method === 'dfs' ? [...children].reverse() : children))
    steps.push({
      current, visited: [...visited], frontier: [...frontier], operation: 'visit',
      explanation: `Visit ${current}. ${children.length ? `Add ${method === 'dfs' ? [...children].reverse().join(', ') : children.join(', ')} to the ${method === 'dfs' ? 'stack' : 'queue'}.` : 'It is a leaf, so there are no children to add.'}`,
    })
  }
  steps.push({ current: null, visited: [...visited], frontier: [], operation: 'complete', explanation: 'All seven nodes have been visited. The frontier is empty, so traversal is complete.' })
  return steps
}
