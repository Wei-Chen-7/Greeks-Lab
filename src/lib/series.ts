import { toDisplayGreeks } from '../math/blackScholes'
import { positionGreeks, type Leg } from './position'
import type { AxisKey, Params, SeriesPoint } from './types'

/**
 * The span swept by each axis. The default windows follow the spec (spot is
 * 0.4K–1.6K, etc.), but each is widened just enough to always contain the current
 * parameter value — and, for spot, every strike — so the reference markers never
 * slide off the chart.
 */
export function axisRange(axis: AxisKey, params: Params, strikes: number[]): [number, number] {
  switch (axis) {
    case 'S': {
      // A sensible window around the strikes, expanded to keep the markers visible.
      const minK = Math.min(...strikes)
      const maxK = Math.max(...strikes)
      const lo = Math.min(0.4 * minK, 0.9 * params.S)
      const hi = Math.max(1.6 * maxK, 1.1 * params.S)
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
 * holding every other parameter fixed. Each point carries all metrics for the whole
 * position, already scaled to display conventions, so a single sweep feeds every
 * chart. (The sweep never touches strike, so the legs stay fixed across it.)
 */
export function buildSeries(
  legs: Leg[],
  params: Params,
  axis: AxisKey,
  range: [number, number],
  points = 200,
): SeriesPoint[] {
  const [min, max] = range
  const step = (max - min) / (points - 1)
  const out: SeriesPoint[] = new Array(points)

  for (let i = 0; i < points; i++) {
    const x = min + step * i
    const g = toDisplayGreeks(positionGreeks(legs, { ...params, [axis]: x }))
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
