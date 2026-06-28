import { useCallback, useMemo, useState } from 'react'
import { ChartGrid } from './components/ChartGrid'
import { Controls } from './components/Controls'
import { ReadoutPanel } from './components/ReadoutPanel'
import { axisMeta } from './lib/metrics'
import { axisRange, buildSeries } from './lib/series'
import type { AxisKey, OptionType, Params } from './lib/types'
import { blackScholes, toDisplayGreeks } from './math/blackScholes'

const DEFAULT_PARAMS: Params = {
  S: 100,
  K: 100,
  T: 1,
  sigma: 0.2,
  r: 0.05,
  q: 0,
}

const POINTS = 200

function App() {
  const [params, setParams] = useState<Params>(DEFAULT_PARAMS)
  const [optionType, setOptionType] = useState<OptionType>('call')
  const [axis, setAxis] = useState<AxisKey>('S')

  const setParam = useCallback(
    <K extends keyof Params>(key: K, value: Params[K]) => {
      setParams((prev) => ({ ...prev, [key]: value }))
    },
    [],
  )

  // One sweep feeds every chart. Memoized so dragging only recomputes on change.
  const series = useMemo(
    () => buildSeries(params, optionType, axis, axisRange(axis, params), POINTS),
    [params, optionType, axis],
  )

  // Display-scaled Greeks at the exact current parameters (readout + chart headers).
  const current = useMemo(
    () => toDisplayGreeks(blackScholes(params, optionType)),
    [params, optionType],
  )

  const meta = axisMeta(axis)

  return (
    <div className="mx-auto flex min-h-full max-w-[1500px] flex-col px-4 py-4 sm:px-6">
      <header className="mb-4 flex items-baseline justify-between border-b border-term-border pb-3">
        <div className="flex items-baseline gap-3">
          <h1 className="text-lg font-bold tracking-tight text-term-text">
            Greeks<span className="text-accent"> Lab</span>
          </h1>
          <span className="hidden text-xs text-term-muted sm:inline">
            interactive Black–Scholes sandbox
          </span>
        </div>
        <span className="font-mono text-xs text-term-faint">
          {optionType.toUpperCase()} · vs {meta.label} · {POINTS} pts
        </span>
      </header>

      <div className="flex flex-col gap-4 lg:flex-row">
        <aside className="flex w-full shrink-0 flex-col gap-4 lg:w-80">
          <Controls
            params={params}
            setParam={setParam}
            optionType={optionType}
            setOptionType={setOptionType}
            axis={axis}
            setAxis={setAxis}
          />
          <ReadoutPanel values={current} />
        </aside>

        <main className="min-w-0 flex-1">
          <ChartGrid data={series} axis={axis} params={params} current={current} />
        </main>
      </div>
    </div>
  )
}

export default App
