interface SliderRowProps {
  label: string
  /** Current value, in the slider's own units. */
  value: number
  min: number
  max: number
  step: number
  /** Render the value for the inline display (e.g. "20%", "0.50y"). */
  format: (v: number) => string
  onChange: (v: number) => void
  /** Primary sliders (S, sigma, T) are rendered larger / highlighted. */
  primary?: boolean
}

/** A labelled range slider with a live, monospaced value readout. */
export function SliderRow({
  label,
  value,
  min,
  max,
  step,
  format,
  onChange,
  primary = false,
}: SliderRowProps) {
  return (
    <div className={primary ? 'py-1.5' : 'py-1'}>
      <div className="mb-1 flex items-baseline justify-between">
        <span
          className={
            primary
              ? 'text-sm font-semibold text-term-text'
              : 'text-xs font-medium text-term-muted'
          }
        >
          {label}
        </span>
        <span
          className={
            'font-mono tabular-nums ' +
            (primary ? 'text-sm text-accent' : 'text-xs text-term-text')
          }
        >
          {format(value)}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={'w-full cursor-pointer ' + (primary ? 'h-2' : 'h-1.5')}
        aria-label={label}
      />
    </div>
  )
}
