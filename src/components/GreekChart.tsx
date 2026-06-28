import { memo } from 'react'
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { AxisMeta, MetricMeta } from '../lib/metrics'
import { chartColors } from '../lib/theme'
import { fmt, fmtTick } from '../lib/format'
import type { SeriesPoint } from '../lib/types'

interface GreekChartProps {
  metric: MetricMeta
  axis: AxisMeta
  data: SeriesPoint[]
  /** Where to draw the vertical reference line (current axis value). */
  referenceX: number
  /** The metric's value at the current parameters, shown in the header. */
  currentValue: number
}

interface TooltipPayload {
  value: number
  payload: SeriesPoint
}

function ChartTooltip({
  active,
  payload,
  axis,
  metric,
}: {
  active?: boolean
  payload?: TooltipPayload[]
  axis: AxisMeta
  metric: MetricMeta
}) {
  if (!active || !payload || payload.length === 0) return null
  const point = payload[0].payload
  return (
    <div className="rounded-md border border-term-border bg-term-bg/95 px-2.5 py-1.5 text-xs shadow-lg">
      <div className="text-term-muted">
        {axis.short}: <span className="text-term-text">{axis.format(point.x)}</span>
      </div>
      <div className="text-term-muted">
        {metric.label}:{' '}
        <span className="font-mono text-accent">{fmt(payload[0].value, metric.precision)}</span>
      </div>
    </div>
  )
}

function GreekChartImpl({ metric, axis, data, referenceX, currentValue }: GreekChartProps) {
  return (
    <div className="flex flex-col rounded-lg border border-term-border bg-term-panel p-3">
      <div className="mb-1 flex items-baseline justify-between">
        <div className="flex items-baseline gap-2">
          <h3 className="text-sm font-semibold tracking-wide text-term-text">{metric.label}</h3>
          <span className="text-[10px] uppercase tracking-wider text-term-faint">{metric.unit}</span>
        </div>
        <span className="font-mono text-sm tabular-nums text-accent">
          {fmt(currentValue, metric.precision)}
        </span>
      </div>
      <div className="h-40 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 6, right: 10, bottom: 2, left: -6 }}>
            <CartesianGrid stroke={chartColors.grid} strokeDasharray="2 4" />
            <XAxis
              dataKey="x"
              type="number"
              domain={['dataMin', 'dataMax']}
              tickFormatter={axis.format}
              stroke={chartColors.axis}
              tick={{ fill: chartColors.tick, fontSize: 10 }}
              tickCount={6}
              tickLine={false}
            />
            <YAxis
              stroke={chartColors.axis}
              tick={{ fill: chartColors.tick, fontSize: 10 }}
              tickFormatter={fmtTick}
              width={48}
              tickLine={false}
            />
            <Tooltip
              content={<ChartTooltip axis={axis} metric={metric} />}
              isAnimationActive={false}
              cursor={{ stroke: chartColors.axis, strokeDasharray: '3 3' }}
            />
            <ReferenceLine y={0} stroke={chartColors.zeroLine} strokeWidth={1} />
            <ReferenceLine
              x={referenceX}
              stroke={chartColors.reference}
              strokeDasharray="4 3"
              strokeWidth={1.5}
            />
            <Line
              type="monotone"
              dataKey={metric.key}
              stroke={chartColors.accent}
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export const GreekChart = memo(GreekChartImpl)
