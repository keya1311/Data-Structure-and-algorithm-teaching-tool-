import { useState } from 'react'
import type { SubmitEvent } from 'react'
import { algorithmDetails, arrayAlgorithm, parseArrayInput } from './arrayAlgorithms'
import type { ArrayAlgorithm, ArrayStep } from './arrayAlgorithms'
import './ArrayAlgorithmLesson.css'

const example = [7, 3, 5, 1, 9, 2]

export default function ArrayAlgorithmLesson() {
  const [algorithm, setAlgorithm] = useState<ArrayAlgorithm>('linear')
  const [input, setInput] = useState(example.join(', '))
  const [target, setTarget] = useState('5')
  const [values, setValues] = useState(example)
  const [steps, setSteps] = useState<ArrayStep[]>([])
  const [position, setPosition] = useState(0)
  const [error, setError] = useState('')
  const step = steps[position]
  const shown = step?.values ?? values
  const detail = algorithmDetails[algorithm]
  const scale = Math.max(1, ...shown.map(Math.abs))

  function clearRun() {
    setSteps([])
    setPosition(0)
    setError('')
  }

  function start(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    clearRun()
    try {
      const parsed = parseArrayInput(input)
      if (algorithm === 'linear' && target.trim() === '') throw new Error('Enter a target number.')
      const trace = arrayAlgorithm(algorithm, parsed, Number(target))
      setValues(parsed)
      setSteps(trace)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to start this demonstration.')
    }
  }

  function reset() {
    setInput(example.join(', '))
    setTarget('5')
    setValues(example)
    clearRun()
  }

  return (
    <section className="feature array-lab" id="array-lab" aria-labelledby="array-title">
      <div className="feature-heading"><span>03 — SEARCH & SORT</span><span>Six algorithms. Follow every decision.</span></div>
      <h2 id="array-title">Compare the approaches.</h2>
      <p>Choose an algorithm, then step through its work. Negative values and duplicates are welcome; bar heights show magnitude, with signed values printed above.</p>
      <label className="algorithm-choice" htmlFor="array-method">Algorithm
        <select id="array-method" value={algorithm} onChange={event => { setAlgorithm(event.target.value as ArrayAlgorithm); clearRun() }}>
          {Object.entries(algorithmDetails).map(([key, item]) => <option key={key} value={key}>{item.name}</option>)}
        </select>
      </label>
      <p className="algorithm-description">{detail.description}</p>
      <form className="lab-form" onSubmit={start} noValidate>
        <label htmlFor="lab-values">Array (up to 12 values)
          <input id="lab-values" value={input} aria-describedby="lab-error" aria-invalid={Boolean(error)} onChange={event => { setInput(event.target.value); clearRun() }} />
        </label>
        {algorithm === 'linear' && <label htmlFor="lab-target">Linear search target
          <input id="lab-target" value={target} inputMode="decimal" aria-describedby="lab-error" onChange={event => { setTarget(event.target.value); clearRun() }} />
        </label>}
        <button type="submit">Start {detail.name.toLowerCase()}</button>
      </form>
      <p id="lab-error" className="search-error" role="alert">{error}</p>
      <div className="lab-panel">
        <div className="lab-metrics"><span>COMPARISONS <strong>{step?.comparisons ?? 0}</strong></span><span>ARRAY WRITES <strong>{step?.writes ?? 0}</strong></span><span>STEP <strong>{steps.length ? position + 1 : 0} / {steps.length}</strong></span></div>
        <div className="bar-scroll" tabIndex={0} role="region" aria-label="Algorithm bars, scroll for more values">
          <ol className="algorithm-bars" aria-label="Array algorithm values">
            {shown.map((value, index) => <li key={index} className={`${step?.active.includes(index) ? 'bar-active ' : ''}${step?.settled.includes(index) ? 'bar-settled' : ''}`}>
              <strong>{value}</strong><div className="bar-track"><span style={{ height: `${15 + Math.abs(value) / scale * 85}%` }} /></div><span>Index {index}</span><small>{step?.settled.includes(index) ? (algorithm === 'linear' ? 'FOUND' : 'FINAL') : step?.active.includes(index) ? 'ACTIVE' : 'WAITING'}</small>
            </li>)}
          </ol>
        </div>
        <div className="lab-status" role="status" aria-live="polite" aria-atomic="true"><strong>{step?.phase ?? 'Ready to start'}</strong><p>{step?.explanation ?? 'Submit the input to calculate a trace. Editing the input or changing the algorithm clears that trace.'}</p></div>
        <div className="step-controls lab-controls">
          <button type="button" disabled={!step || position === 0} onClick={() => setPosition(current => current - 1)}>Previous array step</button>
          <button type="button" disabled={!step || position === steps.length - 1} onClick={() => setPosition(current => current + 1)}>Next array step</button>
          <button type="button" onClick={reset}>Reset array example</button>
        </div>
      </div>
      <div className="complexity-panel" aria-label="Array algorithm complexity">
        <article><h3>Current stage</h3><p>{step?.stageCost ?? 'No algorithm work yet. Parsing and validating n inputs takes O(n).'}</p></article>
        <article><h3>Whole algorithm</h3><p>{detail.time}</p><p>{detail.space}</p></article>
        <article><h3>What is being counted?</h3><p>n is the number of values; k is the current range length. Counters include data comparisons and writes to the displayed working array, not loop checks, input parsing or temporary-buffer copies.</p></article>
      </div>
      <p className="trace-note">Complexities above describe the standard algorithm. Input validation and the initial copy take O(n) before searching or sorting. This tool additionally copies array state into every snapshot for replay: O(n) extra time and storage per snapshot. A quadratic sort can therefore generate O(n³) recording overhead; the 12-value limit keeps the demonstration small. These counts describe operations, not elapsed milliseconds.</p>
    </section>
  )
}
