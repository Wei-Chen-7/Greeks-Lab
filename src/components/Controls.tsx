import { AXES } from '../lib/metrics'
import type { AxisKey, OptionType, Params } from '../lib/types'
import { Segmented } from './Segmented'
import { SliderRow } from './SliderRow'

interface ControlsProps {
  params: Params
  setParam: <K extends keyof Params>(key: K, value: Params[K]) => void
  optionType: OptionType
  setOptionType: (t: OptionType) => void
  axis: AxisKey
  setAxis: (a: AxisKey) => void
}

const OPTION_OPTIONS = [
  { value: 'call' as const, label: 'Call' },
  { value: 'put' as const, label: 'Put' },
]

const AXIS_OPTIONS = AXES.map((a) => ({ value: a.key, label: a.short }))

export function Controls({
  params,
  setParam,
  optionType,
  setOptionType,
  axis,
  setAxis,
}: ControlsProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        <Segmented label="Option" value={optionType} options={OPTION_OPTIONS} onChange={setOptionType} />
        <Segmented label="X-axis" value={axis} options={AXIS_OPTIONS} onChange={setAxis} />
      </div>

      {/* Primary drivers — the stars of the sandbox. */}
      <section className="rounded-lg border border-term-border bg-term-panel p-3">
        <h2 className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-accent">
          Primary
        </h2>
        <SliderRow
          label="Spot  S"
          value={params.S}
          min={1}
          max={300}
          step={0.5}
          format={(v) => v.toFixed(2)}
          onChange={(v) => setParam('S', v)}
          primary
        />
        <SliderRow
          label="Volatility  σ"
          value={params.sigma * 100}
          min={1}
          max={150}
          step={0.5}
          format={(v) => `${v.toFixed(1)}%`}
          onChange={(v) => setParam('sigma', v / 100)}
          primary
        />
        <SliderRow
          label="Time to expiry  T"
          value={params.T}
          min={0.01}
          max={2}
          step={0.01}
          format={(v) => `${v.toFixed(2)} y`}
          onChange={(v) => setParam('T', v)}
          primary
        />
      </section>

      {/* Secondary parameters. */}
      <section className="rounded-lg border border-term-border bg-term-panel p-3">
        <h2 className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-term-faint">
          Market
        </h2>
        <SliderRow
          label="Strike  K"
          value={params.K}
          min={1}
          max={300}
          step={0.5}
          format={(v) => v.toFixed(2)}
          onChange={(v) => setParam('K', v)}
        />
        <SliderRow
          label="Risk-free rate  r"
          value={params.r * 100}
          min={-5}
          max={15}
          step={0.05}
          format={(v) => `${v.toFixed(2)}%`}
          onChange={(v) => setParam('r', v / 100)}
        />
        <SliderRow
          label="Dividend yield  q"
          value={params.q * 100}
          min={0}
          max={10}
          step={0.05}
          format={(v) => `${v.toFixed(2)}%`}
          onChange={(v) => setParam('q', v / 100)}
        />
      </section>
    </div>
  )
}
