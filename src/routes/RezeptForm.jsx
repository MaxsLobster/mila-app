import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Plus, Trash2, Save } from 'lucide-react'
import { useRecipe, saveRecipe } from '../db/hooks'
import {
  CATEGORIES,
  CUISINES,
  DEVICES,
  CATEGORY_LABELS,
  CUISINE_LABELS,
  DEVICE_LABELS,
  emptyRecipe,
} from '../lib/recipe'

export default function RezeptForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const existing = useRecipe(id)
  const isEdit = Boolean(id)

  const [form, setForm] = useState(() => (isEdit ? null : emptyRecipe()))

  useEffect(() => {
    if (isEdit && existing) {
      setForm({
        ...existing,
        ingredients: existing.ingredients?.length ? existing.ingredients : [{ name: '', amount: '', unit: '', pantry_basic: false }],
        steps: existing.steps?.length ? existing.steps : [''],
      })
    }
  }, [isEdit, existing])

  if (isEdit && !form) return <div className="h-64 bg-black/5 rounded-2xl animate-pulse" />
  if (isEdit && existing === null) {
    return (
      <div className="text-center py-16">
        <p className="font-medium">Rezept nicht gefunden</p>
        <Link to="/rezepte" className="inline-block mt-4 text-terracotta hover:underline">Zurück</Link>
      </div>
    )
  }

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function updateIngredient(i, field, value) {
    setForm((prev) => {
      const ingredients = prev.ingredients.map((ing, idx) => (idx === i ? { ...ing, [field]: value } : ing))
      return { ...prev, ingredients }
    })
  }

  function addIngredient() {
    setForm((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients, { name: '', amount: '', unit: '', pantry_basic: false }],
    }))
  }

  function removeIngredient(i) {
    setForm((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, idx) => idx !== i),
    }))
  }

  function updateStep(i, value) {
    setForm((prev) => ({ ...prev, steps: prev.steps.map((s, idx) => (idx === i ? value : s)) }))
  }

  function addStep() {
    setForm((prev) => ({ ...prev, steps: [...prev.steps, ''] }))
  }

  function removeStep(i) {
    setForm((prev) => ({ ...prev, steps: prev.steps.filter((_, idx) => idx !== i) }))
  }

  function toggleDevice(device) {
    setForm((prev) => ({
      ...prev,
      device: prev.device.includes(device)
        ? prev.device.filter((d) => d !== device)
        : [...prev.device, device],
    }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.name.trim()) return
    const cleaned = {
      ...form,
      name: form.name.trim(),
      ingredients: form.ingredients.filter((ing) => ing.name.trim()),
      steps: form.steps.map((s) => s.trim()).filter(Boolean),
    }
    await saveRecipe(cleaned)
    navigate(`/rezepte/${cleaned.id}`)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-10">
      <Link
        to={isEdit ? `/rezepte/${id}` : '/rezepte'}
        className="inline-flex items-center gap-1.5 text-sm text-ink/60 hover:text-ink"
      >
        <ArrowLeft size={16} />
        Abbrechen
      </Link>

      <header>
        <p className="text-[11px] text-ink/50 uppercase tracking-[0.15em] font-semibold">
          {isEdit ? 'Bearbeiten' : 'Neu'}
        </p>
        <h1 className="text-[32px] md:text-4xl font-semibold tracking-tight mt-1 leading-none">
          {isEdit ? form.name || 'Rezept' : 'Neues Rezept'}
        </h1>
      </header>

      {/* Basics */}
      <Section title="Basics">
        <Field label="Name">
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            placeholder="z. B. Spaghetti Carbonara"
            className={inputClass}
          />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Kategorie">
            <select value={form.category} onChange={(e) => update('category', e.target.value)} className={inputClass}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>)}
            </select>
          </Field>
          <Field label="Küche">
            <select value={form.cuisine} onChange={(e) => update('cuisine', e.target.value)} className={inputClass}>
              {CUISINES.map((c) => <option key={c} value={c}>{CUISINE_LABELS[c]}</option>)}
            </select>
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Zeit (Minuten)">
            <input
              type="number"
              min={1}
              value={form.time_min}
              onChange={(e) => update('time_min', Number(e.target.value))}
              className={inputClass}
            />
          </Field>
          <Field label="Portionen">
            <input
              type="number"
              min={1}
              value={form.portions}
              onChange={(e) => update('portions', Number(e.target.value))}
              className={inputClass}
            />
          </Field>
        </div>
        <label className="flex items-center gap-2.5 cursor-pointer select-none pt-1">
          <input
            type="checkbox"
            checked={form.valerie_tauglich}
            onChange={(e) => update('valerie_tauglich', e.target.checked)}
            className="w-5 h-5 accent-sage"
          />
          <span className="text-[15px]">Valerie-tauglich</span>
        </label>
      </Section>

      {/* Devices */}
      <Section title="Geräte">
        <div className="flex flex-wrap gap-2">
          {DEVICES.map((d) => {
            const on = form.device.includes(d)
            return (
              <button
                type="button"
                key={d}
                onClick={() => toggleDevice(d)}
                className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition ${
                  on
                    ? 'bg-terracotta text-cream'
                    : 'bg-white border border-black/10 text-ink/70 hover:border-terracotta/30'
                }`}
              >
                {DEVICE_LABELS[d]}
              </button>
            )
          })}
        </div>
      </Section>

      {/* Ingredients */}
      <Section title="Zutaten" action={<AddButton onClick={addIngredient} />}>
        <div className="space-y-2">
          {form.ingredients.map((ing, i) => (
            <div key={i} className="bg-white rounded-xl border border-black/5 p-3 space-y-2">
              <input
                type="text"
                value={ing.name}
                onChange={(e) => updateIngredient(i, 'name', e.target.value)}
                placeholder="Zutat"
                className={inputClass}
              />
              <div className="grid grid-cols-[1fr_1fr_auto] gap-2 items-center">
                <input
                  type="text"
                  value={ing.amount}
                  onChange={(e) => updateIngredient(i, 'amount', e.target.value)}
                  placeholder="Menge"
                  className={inputClass}
                />
                <input
                  type="text"
                  value={ing.unit}
                  onChange={(e) => updateIngredient(i, 'unit', e.target.value)}
                  placeholder="Einheit"
                  className={inputClass}
                />
                <button
                  type="button"
                  onClick={() => removeIngredient(i)}
                  className="p-2 rounded-lg hover:bg-red-50 text-ink/40 hover:text-red-600 transition"
                  aria-label="Entfernen"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={ing.pantry_basic}
                  onChange={(e) => updateIngredient(i, 'pantry_basic', e.target.checked)}
                  className="w-4 h-4 accent-sage"
                />
                <span className="text-xs text-ink/55">Pantry-Basic (nicht auf Einkaufsliste)</span>
              </label>
            </div>
          ))}
        </div>
      </Section>

      {/* Steps */}
      <Section title="Schritte" action={<AddButton onClick={addStep} />}>
        <div className="space-y-2">
          {form.steps.map((step, i) => (
            <div key={i} className="bg-white rounded-xl border border-black/5 p-3 flex gap-3">
              <span className="w-7 h-7 shrink-0 rounded-full bg-terracotta/10 text-terracotta flex items-center justify-center text-sm font-semibold mt-0.5">
                {i + 1}
              </span>
              <textarea
                value={step}
                onChange={(e) => updateStep(i, e.target.value)}
                placeholder="Schritt beschreiben …"
                rows={2}
                className="flex-1 bg-transparent outline-none text-[15px] resize-none"
              />
              <button
                type="button"
                onClick={() => removeStep(i)}
                className="p-2 rounded-lg hover:bg-red-50 text-ink/40 hover:text-red-600 transition self-start"
                aria-label="Entfernen"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </Section>

      {/* Notes */}
      <Section title="Notizen">
        <textarea
          value={form.notes}
          onChange={(e) => update('notes', e.target.value)}
          rows={4}
          placeholder="Tipps, Varianten, Lagerung, Hinweise für Valerie …"
          className={`${inputClass} resize-y`}
        />
      </Section>

      {/* Actions */}
      <div className="flex gap-2 sticky bottom-20 md:bottom-6 z-30 pt-2">
        <button
          type="submit"
          disabled={!form.name.trim()}
          className="flex-1 flex items-center justify-center gap-2 bg-terracotta text-cream font-medium py-3.5 rounded-xl disabled:opacity-50 hover:brightness-95 active:brightness-90 transition shadow-lg shadow-terracotta/20"
        >
          <Save size={17} strokeWidth={2.2} />
          Speichern
        </button>
      </div>
    </form>
  )
}

const inputClass =
  'w-full bg-white border border-black/10 rounded-lg px-3 py-2.5 text-[15px] placeholder:text-ink/40 focus:outline-none focus:border-terracotta/40'

function Section({ title, children, action }) {
  return (
    <section>
      <div className="flex items-center justify-between mb-3 px-1">
        <h2 className="text-[11px] uppercase tracking-[0.15em] text-ink/50 font-semibold">{title}</h2>
        {action}
      </div>
      <div className="space-y-2">{children}</div>
    </section>
  )
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="block text-xs font-medium text-ink/60 mb-1.5">{label}</span>
      {children}
    </label>
  )
}

function AddButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-1 text-xs font-medium text-terracotta hover:underline"
    >
      <Plus size={14} strokeWidth={2.5} /> Hinzufügen
    </button>
  )
}
