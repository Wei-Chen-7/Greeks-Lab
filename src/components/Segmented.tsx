interface SegmentedOption<T extends string> {
  value: T
  label: string
}

interface SegmentedProps<T extends string> {
  label: string
  value: T
  options: readonly SegmentedOption<T>[]
  onChange: (value: T) => void
}

/** A small segmented control (used for Call/Put and the x-axis switch). */
export function Segmented<T extends string>({ label, value, options, onChange }: SegmentedProps<T>) {
  return (
    <div>
      <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-term-faint">
        {label}
      </div>
      <div className="flex rounded-md border border-term-border bg-term-bg p-0.5">
        {options.map((opt) => {
          const active = opt.value === value
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={
                'flex-1 rounded px-2 py-1 text-xs font-medium transition-colors ' +
                (active
                  ? 'bg-accent text-term-bg'
                  : 'text-term-muted hover:text-term-text')
              }
            >
              {opt.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
