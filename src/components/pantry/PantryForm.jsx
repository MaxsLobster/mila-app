import { useState } from 'react'
import { LOCATIONS, LOCATION_LABELS } from '../../lib/pantry'

export default function PantryForm({ defaultLocation, onSave, onCancel }) {
  const [name, setName] = useState('')
  const [location, setLocation] = useState(defaultLocation ?? 'kuehlschrank')
  const [amount, setAmount] = useState('')
  const [unit, setUnit] = useState('')
  const [expires, setExpires] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim()) return
    await onSave({
      name: name.trim(),
      location,
      amount: amount.trim(),
      unit: unit.trim(),
      expires: expires || null,
    })
    setName('')
    setAmount('')
    setUnit('')
    setExpires('')
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-black/5 p-4 space-y-3">
      <input
        type="text"
        autoFocus
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Was? (z. B. Bolognese-Cube, Hackfleisch)"
        className="w-full border border-black/10 rounded-lg px-3 py-2.5 text-[15px] placeholder:text-ink/40 focus:outline-none focus:border-terracotta/40"
      />

      {/* Location segmented control */}
      <div className="flex gap-1 bg-black/[0.03] border border-black/5 rounded-lg p-1">
        {LOCATIONS.map((loc) => (
          <button
            type="button"
            key={loc}
            onClick={() => setLocation(loc)}
            className={`flex-1 px-3 py-1.5 rounded-md text-sm font-medium transition ${
              location === loc
                ? 'bg-white text-ink shadow-sm'
                : 'text-ink/55 hover:text-ink'
            }`}
          >
            {LOCATION_LABELS[loc]}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <input
          type="text"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Menge"
          className="border border-black/10 rounded-lg px-3 py-2.5 text-[15px] placeholder:text-ink/40 focus:outline-none focus:border-terracotta/40"
        />
        <input
          type="text"
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          placeholder="Einheit (g, Cubes, Stück)"
          className="border border-black/10 rounded-lg px-3 py-2.5 text-[15px] placeholder:text-ink/40 focus:outline-none focus:border-terracotta/40"
        />
      </div>

      <label className="block">
        <span className="block text-xs font-medium text-ink/55 mb-1.5">Ablaufdatum (optional)</span>
        <input
          type="date"
          value={expires}
          onChange={(e) => setExpires(e.target.value)}
          className="w-full border border-black/10 rounded-lg px-3 py-2.5 text-[15px] focus:outline-none focus:border-terracotta/40"
        />
      </label>

      <div className="flex gap-2 pt-1">
        <button
          type="submit"
          disabled={!name.trim()}
          className="flex-1 bg-terracotta text-cream font-medium py-2.5 rounded-lg disabled:opacity-40 hover:brightness-95 transition"
        >
          Hinzufügen
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2.5 border border-black/10 rounded-lg hover:bg-black/[0.03] transition text-sm font-medium text-ink/70"
        >
          Schließen
        </button>
      </div>
    </form>
  )
}
