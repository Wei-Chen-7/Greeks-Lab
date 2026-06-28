import { describe, expect, it } from 'vitest'
import { normalCdf, phi } from './normal'

describe('normalCdf (standard normal CDF)', () => {
  it('is 0.5 at the mean', () => {
    expect(normalCdf(0)).toBeCloseTo(0.5, 6)
  })

  it('matches the classic 1.96 -> 0.975 two-sided table value', () => {
    expect(normalCdf(1.96)).toBeCloseTo(0.975, 4)
  })

  it('matches 1.645 -> 0.95 (one-sided 90% bound)', () => {
    expect(normalCdf(1.645)).toBeCloseTo(0.95, 4)
  })

  it('matches 2.326 -> 0.99', () => {
    expect(normalCdf(2.326)).toBeCloseTo(0.99, 4)
  })

  it('matches a one-sigma value, N(1) ~ 0.8413', () => {
    expect(normalCdf(1)).toBeCloseTo(0.8413, 4)
  })

  it('is symmetric: N(-x) = 1 - N(x)', () => {
    for (const x of [0.3, 1, 1.96, 2.5, 3.1]) {
      expect(normalCdf(-x)).toBeCloseTo(1 - normalCdf(x), 6)
    }
  })

  it('saturates in the tails', () => {
    expect(normalCdf(-6)).toBeCloseTo(0, 5)
    expect(normalCdf(6)).toBeCloseTo(1, 5)
  })

  it('is monotonically increasing', () => {
    let prev = normalCdf(-5)
    for (let x = -5; x <= 5; x += 0.1) {
      const cur = normalCdf(x)
      expect(cur).toBeGreaterThanOrEqual(prev - 1e-12)
      prev = cur
    }
  })
})

describe('phi (standard normal PDF)', () => {
  it('peaks at 0 with value 1/sqrt(2*pi)', () => {
    expect(phi(0)).toBeCloseTo(0.3989422804, 9)
  })

  it('matches phi(1) ~ 0.2419707', () => {
    expect(phi(1)).toBeCloseTo(0.2419707245, 9)
  })

  it('is symmetric', () => {
    expect(phi(-1.3)).toBeCloseTo(phi(1.3), 12)
  })

  it('integrates (roughly) to 1 via a coarse Riemann sum', () => {
    let area = 0
    const dx = 0.001
    for (let x = -8; x <= 8; x += dx) area += phi(x) * dx
    expect(area).toBeCloseTo(1, 4)
  })
})
