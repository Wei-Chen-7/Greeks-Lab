import { METRICS, axisMeta } from '../lib/metrics'
import type { AxisKey, Params, SeriesPoint } from '../lib/types'
import type { Greeks } from '../math/blackScholes'
import { GreekChart } from './GreekChart'

interface ChartGridProps {
  data: SeriesPoint[]
  axis: AxisKey
  params: Params
  /** Display-scaled Greeks at the current parameters (for the chart headers). */
  current: Greeks
}

/** Responsive grid of one small line chart per metric. */
export function ChartGrid({ data, axis, params, current }: ChartGridProps) {
  const meta = axisMeta(axis)
  const referenceX = params[axis]
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {METRICS.map((metric) => (
        <GreekChart
          key={metric.key}
          metric={metric}
          axis={meta}
          data={data}
          referenceX={referenceX}
          currentValue={current[metric.key]}
        />
      ))}
    </div>
  )
}
