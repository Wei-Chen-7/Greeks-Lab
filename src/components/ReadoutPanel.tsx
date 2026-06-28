import { METRICS } from '../lib/metrics'
import { fmt } from '../lib/format'
import type { Greeks } from '../math/blackScholes'

interface ReadoutPanelProps {
  /** Display-scaled Greeks at the current parameters. */
  values: Greeks
}

/** Compact grid of the current numeric values, updating live. */
export function ReadoutPanel({ values }: ReadoutPanelProps) {
  return (
    <section className="rounded-lg border border-term-border bg-term-panel p-3">
      <h2 className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-term-faint">
        Live readout
      </h2>
      <dl className="grid grid-cols-3 gap-x-3 gap-y-2.5 sm:grid-cols-6 lg:grid-cols-2">
        {METRICS.map((m) => (
          <div
            key={m.key}
            className="flex flex-col rounded-md border border-term-border/60 bg-term-bg/40 px-2.5 py-1.5"
          >
            <dt className="text-[10px] uppercase tracking-wider text-term-faint">{m.label}</dt>
            <dd className="font-mono text-base tabular-nums text-accent">
              {fmt(values[m.key], m.precision)}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
