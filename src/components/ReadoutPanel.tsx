import { METRICS } from '../lib/metrics'
import { fmt } from '../lib/format'
import type { Greeks } from '../math/blackScholes'

interface ReadoutPanelProps {
  /** Display-scaled Greeks at the current parameters. */
  values: Greeks
  /** Short description of the plotted position (e.g. "Long 100C · Short 120C"). */
  position: string
}

/** Compact grid of the current numeric values, updating live. */
export function ReadoutPanel({ values, position }: ReadoutPanelProps) {
  return (
    <section className="rounded-lg border border-term-border bg-term-panel p-3">
      <div className="mb-2 flex items-baseline justify-between gap-2">
        <h2 className="text-[10px] font-semibold uppercase tracking-wider text-term-faint">
          Live readout
        </h2>
        <span className="truncate font-mono text-[10px] text-term-muted">{position}</span>
      </div>
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
