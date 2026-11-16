import { useState } from 'react'
import type { SubmitEvent } from 'react'
import { binarySearch } from './binarySearch'
import type { BinarySearchStep } from './binarySearch'

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
      <div className="search-art">
        <div className="art-heading"><span>BINARY / SEARCH</span><span className="target-label">TARGET: {target}</span></div>
        <ol className="lesson-array" aria-label="Search array">
          {values.map((value, index) => {
            const excluded = step && (index < step.low || index > step.high)
            const midpoint = step?.mid === index
            const found = midpoint && step?.operation === 'found'
            const labels = [step?.low === index && 'LOW', step?.high === index && 'HIGH', midpoint && 'MID', found && 'FOUND'].filter(Boolean).join(' · ')
            return (
              <li key={index} className={`array-cell${excluded ? ' is-excluded' : ''}${midpoint ? ' is-midpoint' : ''}${found ? ' is-found' : ''}`}>
                <span className="cell-index">Index {index}</span><strong>{value}</strong>
                <span className="cell-note">{labels || (excluded ? 'EXCLUDED' : 'CANDIDATE')}</span>
              </li>
            )
          })}
        </ol>
        <div className="step-explanation" role="status" aria-live="polite" aria-atomic="true">
          <strong>{step ? `Step ${position + 1} of ${steps.length} · ${step.operation}` : 'Ready to explore'}</strong>
          <p>{step?.explanation ?? 'Enter your values and start the search. Editing an input clears the current run; press Start search to apply it.'}</p>
          {step && <p>Low: {step.low} · High: {step.high} · Mid: {step.mid ?? 'not chosen'}</p>}
        </div>
        <div className="step-controls" aria-label="Search step controls">
          <button type="button" disabled={!step || position === 0} onClick={() => setPosition(current => current - 1)}>Previous step</button>
          <button type="button" disabled={!step || position === steps.length - 1} onClick={() => setPosition(current => current + 1)}>Next step</button>
          <button type="button" onClick={reset}>Reset example</button>
        </div>
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
