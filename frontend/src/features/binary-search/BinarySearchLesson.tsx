import { useState } from 'react'
import type { SubmitEvent } from 'react'
import { binarySearch } from './binarySearch'
import type { BinarySearchStep } from './binarySearch'
import './BinarySearchLesson.css'

const exampleValues = [2, 5, 8, 12, 16]
const exampleTarget = 12

export default function BinarySearchLesson() {
  const [arrayInput, setArrayInput] = useState(exampleValues.join(', '))
  const [targetInput, setTargetInput] = useState(String(exampleTarget))
  const [values, setValues] = useState(exampleValues)
  const [target, setTarget] = useState(exampleTarget)
  const [steps, setSteps] = useState<BinarySearchStep[]>([])
  const [position, setPosition] = useState(0)
  const [error, setError] = useState('')
  const step = steps[position]
  const remaining = step ? step.high - step.low + 1 : values.length
  const compared = steps.slice(0, position + 1).filter(item => item.operation === 'compare').length
  const progress = steps.length ? ((position + 1) / steps.length) * 100 : 0
  const operationNames = { initialise: 'Set the bounds', midpoint: 'Choose the midpoint', compare: 'Compare with the target', 'update-low': 'Keep the right half', 'update-high': 'Keep the left half', found: 'Target found' }
  const codeLines = ['low = 0; high = last index', 'mid = low + floor((high - low) / 2)', 'compare target with values[mid]', 'if target > values[mid]: low = mid + 1', 'if target < values[mid]: high = mid - 1', 'if equal: return mid']
  const activeLine = step ? ['initialise', 'midpoint', 'compare', 'update-low', 'update-high', 'found'].indexOf(step.operation) : -1

  function clearRun() {
    setSteps([])
    setPosition(0)
    setError('')
  }

  function start(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    clearRun()
    try {
      const entries = arrayInput.split(',').map(entry => entry.trim())
      if (entries.some(entry => entry === '')) {
        throw new Error('Enter numbers separated by commas, without empty entries.')
      }
      if (entries.length > 20) {
        throw new Error('Use up to 20 values so each search step is easy to follow.')
      }
      if (targetInput.trim() === '') {
        throw new Error('Enter a target value.')
      }
      const nextValues = entries.map(Number)
      const nextTarget = Number(targetInput)
      const nextSteps = binarySearch(nextValues, nextTarget)
      setValues(nextValues)
      setTarget(nextTarget)
      setSteps(nextSteps)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to start the search.')
    }
  }

  function reset() {
    setArrayInput(exampleValues.join(', '))
    setTargetInput(String(exampleTarget))
    setValues(exampleValues)
    setTarget(exampleTarget)
    clearRun()
  }

  return (
    <div className="binary-lesson">
      <div className="lesson-intro">
        <h3>Try binary search</h3>
        <p>Use ascending numbers and choose a target in the array. Duplicates and decimals are allowed. Indexes start at 0.</p>
      </div>
      <form onSubmit={start} className="search-form" noValidate>
        <label htmlFor="array-input">Sorted array (up to 20 numbers)
          <input id="array-input" value={arrayInput} aria-describedby="array-help search-error" aria-invalid={Boolean(error)} onChange={event => { setArrayInput(event.target.value); clearRun() }} />
        </label>
        <label htmlFor="target-input">Target
          <input id="target-input" type="text" inputMode="decimal" value={targetInput} aria-describedby="search-error" aria-invalid={Boolean(error)} onChange={event => { setTargetInput(event.target.value); clearRun() }} />
        </label>
        <button type="submit">Start search</button>
      </form>
      <p id="array-help">Separate values with commas, for example: 2, 5, 8, 12, 16.</p>
      <p id="search-error" className="search-error" role="alert">{error}</p>
      <div className="binary-workspace">
      <div className="search-art binary-stage">
        <div className="visual-heading"><span>01 / SORTED ARRAY</span><span>{step ? operationNames[step.operation] : 'YOUR SEARCH LAB'}</span></div>
        <div className="art-heading"><span>BINARY / SEARCH</span><span className="target-label">TARGET: {target}</span></div>
        <div className="binary-metrics"><div><span>CANDIDATES</span><strong>{remaining}<small> / {values.length}</small></strong></div><div><span>COMPARISONS</span><strong>{compared}</strong></div><div><span>TARGET</span><strong>{target}</strong></div></div>
        <div className="array-scroll" tabIndex={0} role="region" aria-label="Array visualisation, scroll horizontally for long arrays">
        <ol className="lesson-array" aria-label="Search array">
          {values.map((value, index) => {
            const excluded = step && (index < step.low || index > step.high)
            const midpoint = step?.mid === index
            const found = midpoint && step?.operation === 'found'
            const labels = [step?.low === index && 'LOW', step?.high === index && 'HIGH', midpoint && 'MID', found && 'FOUND'].filter(Boolean).join(' · ')
            return (
              <li key={index} className={`array-cell${excluded ? ' is-excluded' : ''}${midpoint ? ' is-midpoint' : ''}${found ? ' is-found' : ''}`}>
                <span className="cell-index">INDEX {String(index).padStart(2, '0')}</span><strong>{value}</strong>
                <span className="cell-note">{labels || (excluded ? 'EXCLUDED' : 'CANDIDATE')}</span>
              </li>
            )
          })}
        </ol>
        </div>
        <div className="visual-legend"><span>■ Midpoint</span><span>□ Candidate</span><span>▧ Excluded</span><span>✓ Found</span></div>
        <div className="search-progress" role="progressbar" aria-label="Binary search lesson steps" aria-valuemin={0} aria-valuemax={steps.length || 1} aria-valuenow={steps.length ? position + 1 : 0}><span style={{ width: `${progress}%` }} /></div>
        <div className="step-explanation" role="status" aria-live="polite" aria-atomic="true">
          <strong>{step ? `Step ${position + 1} of ${steps.length} · ${operationNames[step.operation]}` : 'Ready to explore'}</strong>
          <p>{step?.explanation ?? 'Enter your values and start the search. Editing an input clears the current run; press Start search to apply it.'}</p>
          {step && <p>Low: {step.low} · High: {step.high} · Mid: {step.mid ?? 'not chosen'}</p>}
        </div>
        <div className="step-controls" aria-label="Search step controls">
          <button type="button" disabled={!step || position === 0} onClick={() => setPosition(current => current - 1)}>Previous step</button>
          <button type="button" disabled={!step || position === steps.length - 1} onClick={() => setPosition(current => current + 1)}>Next step</button>
          <button type="button" onClick={reset}>Reset example</button>
        </div>
      </div>
      <aside className="binary-code" aria-label="Binary search pseudocode">
        <p className="lesson-kicker">THE LOGIC</p><h3>One decision at a time.</h3>
        <ol>{codeLines.map((line, index) => <li key={line} className={index === activeLine ? 'active-code' : ''} aria-current={index === activeLine ? 'step' : undefined}><code>{line}</code></li>)}</ol>
        <p>The highlighted line matches the current step. Low and high enclose every remaining candidate; the midpoint is recalculated after either bound changes.</p>
        <div className="binary-invariant"><span>THE RULE TO KEEP</span><strong>If the target exists, it stays between low and high.</strong></div>
      </aside>
      </div>
      <div className="lesson-notes">
        <h3>Why does it work?</h3>
        <p>The values are sorted. If the target is greater than the midpoint, every value to the left is too small. If it is smaller, every value to the right is too large. Excluding the midpoint and that half leaves only possible answers.</p>
        <p>Each round roughly halves the remaining candidates, giving O(log n) search comparisons. This teaching tool also validates the whole input and checks that the target exists, which takes O(n) time before the demonstration begins.</p>
        <p>This lesson demonstrates successful searches. With duplicate values, it finds a matching index, which may not be the first match.</p>
      </div>
    </div>
  )
}
