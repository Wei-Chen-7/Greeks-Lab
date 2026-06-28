/**
 * Black–Scholes pricing and Greeks for European calls and puts, with a continuous
 * dividend yield q. Everything is implemented by hand (no finance/math libraries)
 * on top of the standard-normal helpers in ./normal.
 *
 * All Greeks are returned in their raw mathematical units. Trader-friendly display
 * scaling (per-day theta, per-1% vega/rho) lives in `toDisplayGreeks` so the raw
 * values stay canonical and testable.
 */
import { normalCdf, phi } from './normal'

export type OptionType = 'call' | 'put'

export interface BSInputs {
  /** Spot price of the underlying. */
  S: number
  /** Strike price. */
  K: number
  /** Time to expiry, in years. */
  T: number
  /** Volatility, as a decimal (0.2 = 20%). */
  sigma: number
  /** Continuously-compounded risk-free rate, as a decimal. */
  r: number
  /** Continuous dividend yield, as a decimal. */
  q: number
}

export interface Greeks {
  price: number
  delta: number
  gamma: number
  theta: number
  vega: number
  rho: number
}

/**
 * Floor applied to T and sigma. As either approaches zero, d1/d2 diverge and the
 * Greeks would return NaN/Infinity; clamping to a tiny positive value keeps every
 * output finite and continuous right up to the edge.
 */
const FLOOR = 1e-6

/** d1 and d2 from the Black–Scholes model. */
function dValues(S: number, K: number, T: number, sigma: number, r: number, q: number) {
  const sqrtT = Math.sqrt(T)
  const d1 = (Math.log(S / K) + (r - q + 0.5 * sigma * sigma) * T) / (sigma * sqrtT)
  const d2 = d1 - sigma * sqrtT
  return { d1, d2, sqrtT }
}

/** Full set of Black–Scholes outputs (price + Greeks) for the given inputs. */
export function blackScholes(inputs: BSInputs, type: OptionType): Greeks {
  // Guard the edge cases: clamp T, sigma, and the positive quantities to tiny floors
  // so nothing divides by zero or takes log(0).
  const S = Math.max(inputs.S, FLOOR)
  const K = Math.max(inputs.K, FLOOR)
  const T = Math.max(inputs.T, FLOOR)
  const sigma = Math.max(inputs.sigma, FLOOR)
  const { r, q } = inputs

  const { d1, d2, sqrtT } = dValues(S, K, T, sigma, r, q)

  const discQ = Math.exp(-q * T)
  const discR = Math.exp(-r * T)
  const Nd1 = normalCdf(d1)
  const Nd2 = normalCdf(d2)
  const NnegD1 = normalCdf(-d1)
  const NnegD2 = normalCdf(-d2)
  const pdfD1 = phi(d1)

  // Gamma and vega are identical for calls and puts.
  const gamma = (discQ * pdfD1) / (S * sigma * sqrtT)
  const vega = S * discQ * pdfD1 * sqrtT

  // Shared theta term: time decay from the diffusion part.
  const decay = -(S * discQ * pdfD1 * sigma) / (2 * sqrtT)

  if (type === 'call') {
    const price = S * discQ * Nd1 - K * discR * Nd2
    const delta = discQ * Nd1
    const theta = decay - r * K * discR * Nd2 + q * S * discQ * Nd1
    const rho = K * T * discR * Nd2
    return { price, delta, gamma, theta, vega, rho }
  }

  const price = K * discR * NnegD2 - S * discQ * NnegD1
  const delta = discQ * (Nd1 - 1)
  const theta = decay + r * K * discR * NnegD2 - q * S * discQ * NnegD1
  const rho = -K * T * discR * NnegD2
  return { price, delta, gamma, theta, vega, rho }
}

/**
 * Trader-facing display conventions:
 *   - theta divided by 365  -> price decay per calendar day
 *   - vega  divided by 100  -> price move per 1% (one vol point) change in sigma
 *   - rho   divided by 100  -> price move per 1% change in the rate
 * Price, delta and gamma are left untouched.
 */
export function toDisplayGreeks(g: Greeks): Greeks {
  return {
    price: g.price,
    delta: g.delta,
    gamma: g.gamma,
    theta: g.theta / 365,
    vega: g.vega / 100,
    rho: g.rho / 100,
  }
}
