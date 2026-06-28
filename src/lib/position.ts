import { blackScholes, type Greeks, type OptionType } from '../math/blackScholes'
import type { Params } from './types'

/** How many legs the plotted position has. */
export type PositionMode = 'single' | 'vertical'

/** One option leg: a quantity (+1 long, -1 short) of a call/put at a strike. */
export interface Leg {
  type: OptionType
  K: number
  qty: number
}

const ZERO: Greeks = { price: 0, delta: 0, gamma: 0, theta: 0, vega: 0, rho: 0 }

/**
 * Build the legs for the current position.
 * - single:   long one option at the primary strike.
 * - vertical: long one at K1 (the primary strike) and short one at K2 — a vertical
 *   spread. Both legs share the option type, so a call/put toggle gives a call/put
 *   vertical; placing K2 above or below K1 yields a bull or bear spread.
 */
export function buildLegs(
  mode: PositionMode,
  type: OptionType,
  K1: number,
  K2: number,
): Leg[] {
  if (mode === 'single') return [{ type, K: K1, qty: 1 }]
  return [
    { type, K: K1, qty: 1 },
    { type, K: K2, qty: -1 },
  ]
}

/** Combined (quantity-weighted) Greeks of the whole position, in raw units. */
export function positionGreeks(legs: Leg[], market: Params): Greeks {
  return legs.reduce<Greeks>(
    (acc, leg) => {
      const g = blackScholes({ ...market, K: leg.K }, leg.type)
      return {
        price: acc.price + leg.qty * g.price,
        delta: acc.delta + leg.qty * g.delta,
        gamma: acc.gamma + leg.qty * g.gamma,
        theta: acc.theta + leg.qty * g.theta,
        vega: acc.vega + leg.qty * g.vega,
        rho: acc.rho + leg.qty * g.rho,
      }
    },
    { ...ZERO },
  )
}

/** Distinct strikes used by the position (for drawing strike reference lines). */
export function positionStrikes(legs: Leg[]): number[] {
  return [...new Set(legs.map((l) => l.K))]
}

/** Short human label, e.g. "Long 100C · Short 120C". */
export function describePosition(legs: Leg[]): string {
  return legs
    .map((l) => `${l.qty > 0 ? 'Long' : 'Short'} ${l.K}${l.type === 'call' ? 'C' : 'P'}`)
    .join(' · ')
}
