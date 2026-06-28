/** Format a number to a fixed precision, rendering tiny magnitudes as a clean 0. */
export function fmt(value: number, precision: number): string {
  if (!Number.isFinite(value)) return '—'
  if (Math.abs(value) < Math.pow(10, -precision) / 2) return (0).toFixed(precision)
  return value.toFixed(precision)
}

/** Compact axis tick label for numeric values that can span a wide range. */
export function fmtTick(value: number): string {
  const abs = Math.abs(value)
  if (abs !== 0 && abs < 0.01) return value.toExponential(0)
  if (abs >= 1000) return value.toFixed(0)
  if (abs >= 1) return value.toFixed(2)
  return value.toFixed(3)
}
