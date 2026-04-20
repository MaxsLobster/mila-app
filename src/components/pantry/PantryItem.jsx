import { Trash2 } from 'lucide-react'
import { daysUntil, expiryTone, formatExpiry, toneClasses, toneDotColor } from '../../lib/pantry'

export default function PantryItem({ item, onRemove }) {
  const days = daysUntil(item.expires)
  const tone = expiryTone(days)
  const amountStr = [item.amount, item.unit].filter(Boolean).join(' ')

  return (
    <div className="flex items-center gap-3 px-5 py-3.5">
      <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${toneDotColor(tone)}`} aria-hidden />

      <div className="flex-1 min-w-0">
        <p className="font-medium leading-tight truncate">{item.name}</p>
        <p className="text-xs text-ink/50 mt-0.5">
          {amountStr || 'ohne Mengenangabe'}
        </p>
      </div>

      {item.expires && (
        <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full ${toneClasses(tone)} shrink-0`}>
          {formatExpiry(days)}
        </span>
      )}

      <button
        onClick={onRemove}
        className="p-1.5 text-ink/30 hover:text-red-600 transition"
        aria-label="Entfernen"
      >
        <Trash2 size={14} />
      </button>
    </div>
  )
}
