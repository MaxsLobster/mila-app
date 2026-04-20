export default function FilterChips({ options, value, onChange, allLabel = 'Alle' }) {
  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-none -mx-5 px-5 pb-1">
      <Chip active={value === null} onClick={() => onChange(null)}>{allLabel}</Chip>
      {options.map(({ value: v, label }) => (
        <Chip key={v} active={value === v} onClick={() => onChange(v)}>{label}</Chip>
      ))}
    </div>
  )
}

function Chip({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 px-3.5 py-1.5 rounded-full text-sm font-medium transition whitespace-nowrap ${
        active
          ? 'bg-terracotta text-cream'
          : 'bg-white border border-black/10 text-ink/70 hover:border-terracotta/30'
      }`}
    >
      {children}
    </button>
  )
}
