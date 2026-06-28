import type { OptionType } from '../math/blackScholes'

export type { OptionType }

/** The quantities we can plot / read out. */
export type MetricKey = 'price' | 'delta' | 'gamma' | 'theta' | 'vega' | 'rho'

/** The independent variable an x-axis can sweep. */
export type AxisKey = 'S' | 'sigma' | 'T'

/** Full set of model parameters driving every computation. */
export interface Params {
  /** Spot price. */
  S: number
  /** Strike price. */
  K: number
  /** Time to expiry, in years. */
  T: number
  /** Volatility, as a decimal (0.2 = 20%). */
  sigma: number
  /** Risk-free rate, as a decimal. */
  r: number
  /** Dividend yield, as a decimal. */
  q: number
}

/** One x-value with every metric computed at that point (display-scaled). */
export type SeriesPoint = { x: number } & Record<MetricKey, number>
