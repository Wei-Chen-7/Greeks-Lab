import { blackScholes, toDisplayGreeks } from '../math/blackScholes'
import type { AxisKey, OptionType, Params, SeriesPoint } from './types'

/**
 * The span swept by each axis. The default windows follow the spec (spot is
 * 0.4K–1.6K, etc.), but each is widened just enough to always contain the current
 * parameter value so the vertical reference marker never slides off the chart.
 */
export function axisRange(axis: AxisKey, params: Params): [number, number] {
  switch (axis) {
    case 'S': {
      // A sensible window around the strike, expanded to keep the spot marker visible.
      const lo = Math.min(0.4 * params.K, 0.9 * params.S)
      const hi = Math.max(1.6 * params.K, 1.1 * params.S)
      return [lo, hi]
    }
    case 'sigma':
      return [0.01, Math.max(1.0, params.sigma * 1.1)]
    case 'T':
      return [1 / 365, Math.max(2, params.T * 1.05)]
  }
}

/**
 * Build the chart series by sweeping `axis` across [min, max] in `points` steps,
 * holding every other parameter fixed. Each point carries all metrics, already
 * scaled to display conventions, so a single sweep feeds every chart.
 */
export function buildSeries(
  params: Params,
  type: OptionType,
  axis: AxisKey,
  range: [number, number],
  points = 200,
): SeriesPoint[] {
  const [min, max] = range
  const step = (max - min) / (points - 1)
  const out: SeriesPoint[] = new Array(points)

  for (let i = 0; i < points; i++) {
    const x = min + step * i
    const g = toDisplayGreeks(blackScholes({ ...params, [axis]: x }, type))
    out[i] = {
      x,
      price: g.price,
      delta: g.delta,
      gamma: g.gamma,
      theta: g.theta,
      vega: g.vega,
      rho: g.rho,
    }
  }
  return out
}
