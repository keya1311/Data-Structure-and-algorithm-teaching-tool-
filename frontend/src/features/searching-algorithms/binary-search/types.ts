export interface BinarySearchStep {
  operation: 'initialise' | 'midpoint' | 'compare' | 'update-low' | 'update-high' | 'found'
  low: number
  high: number
  mid: number | null
  explanation: string
}
