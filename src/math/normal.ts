/**
 * Standard normal distribution helpers.
 *
 * JavaScript has no built-in `erf` or normal CDF, so we implement the CDF with a
 * rational/polynomial approximation. We use Abramowitz & Stegun 7.1.26 for erf(x)
 * (max absolute error ~1.5e-7) and derive the CDF from it:
 *
 *   N(x) = 0.5 * (1 + erf(x / sqrt(2)))
 *
 * That accuracy is far tighter than anything that matters for option Greeks, and it
 * is verified against known values in normal.test.ts (N(0)=0.5, N(1.96)≈0.975, ...).
 */

const SQRT_2 = Math.SQRT2
const INV_SQRT_2PI = 1 / Math.sqrt(2 * Math.PI)

/** Standard normal probability density function, phi(x). */
export function phi(x: number): number {
  return INV_SQRT_2PI * Math.exp(-0.5 * x * x)
}

/**
 * Error function, erf(x), via Abramowitz & Stegun formula 7.1.26.
 * Valid for all real x (odd symmetry handled explicitly): max error ~1.5e-7.
 */
export function erf(x: number): number {
  // Coefficients for A&S 7.1.26.
  const a1 = 0.254829592
  const a2 = -0.284496736
  const a3 = 1.421413741
  const a4 = -1.453152027
  const a5 = 1.061405429
  const p = 0.3275911

  const sign = x < 0 ? -1 : 1
  const ax = Math.abs(x)

  const t = 1 / (1 + p * ax)
  const poly = ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t
  const y = 1 - poly * Math.exp(-ax * ax)

  return sign * y
}

/** Standard normal cumulative distribution function, N(x). */
export function normalCdf(x: number): number {
  return 0.5 * (1 + erf(x / SQRT_2))
}
