import type { AxisKey, MetricKey } from './types'

/** Display metadata shared by the charts, the readout panel and the grid. */
export interface MetricMeta {
  key: MetricKey
  label: string
  /** Short note on units / display convention. */
  unit: string
  /** Decimal places for the numeric readout. */
  precision: number
}

export const METRICS: readonly MetricMeta[] = [
  { key: 'price', label: 'Price', unit: 'option value', precision: 4 },
  { key: 'delta', label: 'Delta', unit: '∂V/∂S', precision: 4 },
  { key: 'gamma', label: 'Gamma', unit: '∂²V/∂S²', precision: 5 },
  { key: 'theta', label: 'Theta', unit: 'per day', precision: 4 },
  { key: 'vega', label: 'Vega', unit: 'per 1% vol', precision: 4 },
  { key: 'rho', label: 'Rho', unit: 'per 1% rate', precision: 4 },
] as const

export interface AxisMeta {
  key: AxisKey
  label: string
  short: string
  /** Format a raw axis value for tick / tooltip display. */
  format: (v: number) => string
}

export const AXES: readonly AxisMeta[] = [
  { key: 'S', label: 'Spot price', short: 'Spot', format: (v) => v.toFixed(0) },
  { key: 'sigma', label: 'Volatility', short: 'Vol', format: (v) => `${(v * 100).toFixed(0)}%` },
  { key: 'T', label: 'Time to expiry', short: 'Time', format: (v) => `${v.toFixed(2)}y` },
] as const

export function axisMeta(key: AxisKey): AxisMeta {
  return AXES.find((a) => a.key === key)!
}
