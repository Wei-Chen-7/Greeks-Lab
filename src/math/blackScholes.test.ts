import { describe, expect, it } from 'vitest'
import { blackScholes, toDisplayGreeks, type BSInputs } from './blackScholes'

// Canonical textbook inputs: S=K=100, T=1y, sigma=20%, r=5%, q=0.
// Widely published Black–Scholes values: call ~ 10.4506, put ~ 5.5735.
const base: BSInputs = { S: 100, K: 100, T: 1, sigma: 0.2, r: 0.05, q: 0 }

describe('blackScholes price', () => {
  it('prices the canonical call', () => {
    expect(blackScholes(base, 'call').price).toBeCloseTo(10.4506, 3)
  })

  it('prices the canonical put', () => {
    expect(blackScholes(base, 'put').price).toBeCloseTo(5.5735, 3)
  })

  it('respects put–call parity: C - P = S*e^-qT - K*e^-rT', () => {
    const i: BSInputs = { S: 105, K: 100, T: 0.75, sigma: 0.3, r: 0.04, q: 0.02 }
    const c = blackScholes(i, 'call').price
    const p = blackScholes(i, 'put').price
    const parity = i.S * Math.exp(-i.q * i.T) - i.K * Math.exp(-i.r * i.T)
    expect(c - p).toBeCloseTo(parity, 8)
  })
})

describe('blackScholes Greeks', () => {
  it('matches reference Greeks for the canonical call', () => {
    const g = blackScholes(base, 'call')
    expect(g.delta).toBeCloseTo(0.636831, 5)
    expect(g.gamma).toBeCloseTo(0.018762, 5)
    expect(g.vega).toBeCloseTo(37.524, 2) // raw
    expect(g.theta).toBeCloseTo(-6.41411, 3) // raw (per year)
    expect(g.rho).toBeCloseTo(53.2325, 3) // raw
  })

  it('delta(call) - delta(put) = e^-qT', () => {
    const i: BSInputs = { S: 92, K: 100, T: 1.5, sigma: 0.25, r: 0.03, q: 0.01 }
    const dc = blackScholes(i, 'call').delta
    const dp = blackScholes(i, 'put').delta
    expect(dc - dp).toBeCloseTo(Math.exp(-i.q * i.T), 10)
  })

  it('gamma and vega are identical for calls and puts', () => {
    const i: BSInputs = { S: 110, K: 100, T: 0.5, sigma: 0.35, r: 0.05, q: 0.02 }
    const c = blackScholes(i, 'call')
    const p = blackScholes(i, 'put')
    expect(c.gamma).toBeCloseTo(p.gamma, 12)
    expect(c.vega).toBeCloseTo(p.vega, 12)
  })

  it('gamma and vega are non-negative', () => {
    const g = blackScholes(base, 'call')
    expect(g.gamma).toBeGreaterThan(0)
    expect(g.vega).toBeGreaterThan(0)
  })

  it('deep ITM call delta -> e^-qT, deep OTM call delta -> 0', () => {
    const itm = blackScholes({ ...base, S: 1000 }, 'call').delta
    const otm = blackScholes({ ...base, S: 1 }, 'call').delta
    expect(itm).toBeCloseTo(1, 4)
    expect(otm).toBeCloseTo(0, 4)
  })
})

describe('edge-case guards', () => {
  it('returns finite numbers as T -> 0', () => {
    for (const T of [0, 1e-9, 1e-6]) {
      const g = blackScholes({ ...base, T }, 'call')
      for (const v of Object.values(g)) expect(Number.isFinite(v)).toBe(true)
    }
  })

  it('returns finite numbers as sigma -> 0', () => {
    for (const sigma of [0, 1e-9, 1e-6]) {
      const g = blackScholes({ ...base, sigma }, 'put')
      for (const v of Object.values(g)) expect(Number.isFinite(v)).toBe(true)
    }
  })

  it('at expiry, price approaches intrinsic value', () => {
    const callItm = blackScholes({ ...base, S: 120, T: 0 }, 'call').price
    expect(callItm).toBeCloseTo(20, 2)
    const callOtm = blackScholes({ ...base, S: 80, T: 0 }, 'call').price
    expect(callOtm).toBeCloseTo(0, 2)
  })
})

describe('toDisplayGreeks', () => {
  it('scales theta/365, vega/100, rho/100 and leaves the rest', () => {
    const g = blackScholes(base, 'call')
    const d = toDisplayGreeks(g)
    expect(d.price).toBe(g.price)
    expect(d.delta).toBe(g.delta)
    expect(d.gamma).toBe(g.gamma)
    expect(d.theta).toBeCloseTo(g.theta / 365, 12)
    expect(d.vega).toBeCloseTo(g.vega / 100, 12)
    expect(d.rho).toBeCloseTo(g.rho / 100, 12)
  })
})
