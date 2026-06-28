import { describe, expect, it } from 'vitest'
import { blackScholes } from '../math/blackScholes'
import type { Params } from './types'
import { buildLegs, describePosition, positionGreeks, positionStrikes } from './position'

const market: Params = { S: 100, K: 100, T: 1, sigma: 0.2, r: 0.05, q: 0 }

describe('buildLegs', () => {
  it('single is one long leg at the primary strike', () => {
    expect(buildLegs('single', 'call', 100, 120)).toEqual([{ type: 'call', K: 100, qty: 1 }])
  })

  it('vertical is long K1 / short K2 of the same type', () => {
    expect(buildLegs('vertical', 'put', 100, 90)).toEqual([
      { type: 'put', K: 100, qty: 1 },
      { type: 'put', K: 90, qty: -1 },
    ])
  })
})

describe('positionGreeks', () => {
  it('single-leg position equals the underlying option', () => {
    const legs = buildLegs('single', 'call', 100, 120)
    const pos = positionGreeks(legs, market)
    const opt = blackScholes(market, 'call')
    expect(pos).toEqual(opt)
  })

  it('vertical spread is leg1 minus leg2, on every Greek', () => {
    const legs = buildLegs('vertical', 'call', 100, 120)
    const pos = positionGreeks(legs, market)
    const long = blackScholes({ ...market, K: 100 }, 'call')
    const short = blackScholes({ ...market, K: 120 }, 'call')
    for (const k of ['price', 'delta', 'gamma', 'theta', 'vega', 'rho'] as const) {
      expect(pos[k]).toBeCloseTo(long[k] - short[k], 10)
    }
  })

  it('a bull call spread has a positive price and bounded delta in [0, 1]', () => {
    const legs = buildLegs('vertical', 'call', 100, 120)
    const pos = positionGreeks(legs, market)
    expect(pos.price).toBeGreaterThan(0)
    expect(pos.delta).toBeGreaterThan(0)
    expect(pos.delta).toBeLessThan(1)
  })

  it('long and short the same strike cancels to zero', () => {
    const legs = [
      { type: 'call' as const, K: 100, qty: 1 },
      { type: 'call' as const, K: 100, qty: -1 },
    ]
    const pos = positionGreeks(legs, market)
    for (const v of Object.values(pos)) expect(v).toBeCloseTo(0, 12)
  })
})

describe('positionStrikes & describePosition', () => {
  it('lists distinct strikes', () => {
    expect(positionStrikes(buildLegs('vertical', 'call', 100, 120))).toEqual([100, 120])
    expect(positionStrikes(buildLegs('single', 'call', 100, 120))).toEqual([100])
  })

  it('describes the position compactly', () => {
    expect(describePosition(buildLegs('vertical', 'call', 100, 120))).toBe(
      'Long 100C · Short 120C',
    )
    expect(describePosition(buildLegs('single', 'put', 95, 0))).toBe('Long 95P')
  })
})
