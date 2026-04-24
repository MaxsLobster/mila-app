import { useRef, useState } from 'react'
import { Download, Upload, Sparkles, Wind, PowerOff, AlertTriangle } from 'lucide-react'
import { useMotion } from '../lib/motion'
import { exportBackup, downloadBackup, validateBackup, importBackupReplace, importBackupMerge, readFileAsJson } from '../lib/backup'
import { useToast } from '../components/ui/Toast'

const MOTION_OPTIONS = [
  {
    value: 'full',
    label: 'Voll',
    description: 'WebGL-Shader, Physics-Explosionen, 3D-Tilt, alle Animationen aktiv.',
    icon: Sparkles,
  },
  {
    value: 'reduced',
    label: 'Ruhig',
    description: 'Shader statisch, keine Physics beim Löschen, keine Card-Tilts.',
    icon: Wind,
  },
  {
    value: 'off',
    label: 'Aus',
    description: 'Reine Gradient-Fallbacks, keine Motion. Beste Performance.',
    icon: PowerOff,
  },
]

export default function Settings() {
  const { setting: motion, setSetting: setMotion, prefersReduced } = useMotion()
  const toast = useToast()
  const fileRef = useRef(null)
  const [importPreview, setImportPreview] = useState(null)

  async function handleExport() {
    const backup = await exportBackup()
    downloadBackup(backup)
    toast(`Backup exportiert (${sum(backup.data)} Einträge)`, { tone: 'success' })
  }

  async function handleFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const json = await readFileAsJson(file)
      const result = validateBackup(json)
      if (!result.ok) {
        toast(result.error, { tone: 'error', duration: 4000 })
        e.target.value = ''
        return
      }
      setImportPreview({ backup: json, data: result.data })
    } catch (err) {
      toast(err.message || 'Import fehlgeschlagen', { tone: 'error', duration: 4000 })
    } finally {
      e.target.value = ''
    }
  }

  async function confirmImport(mode) {
    if (!importPreview) return
    try {
      if (mode === 'replace') await importBackupReplace(importPreview.data)
      else await importBackupMerge(importPreview.data)
      toast(`Import fertig (${mode === 'replace' ? 'ersetzt' : 'gemerged'})`, { tone: 'success' })
      setImportPreview(null)
    } catch (err) {
      toast(err.message || 'Import fehlgeschlagen', { tone: 'error', duration: 4000 })
    }
  }

  return (
    <div className="space-y-6 pb-10">
      <header>
        <p className="text-[11px] text-ink/50 uppercase tracking-[0.15em] font-semibold">System</p>
        <h1 className="text-[32px] md:text-4xl font-semibold tracking-tight mt-1 leading-none">Settings</h1>
      </header>

      {/* Motion */}
      <Section title="Effekte" subtitle={prefersReduced ? 'Dein System hat „Reduzierte Bewegung" aktiv – „Voll" wird automatisch auf „Ruhig" heruntergestuft.' : null}>
        <div className="bg-white rounded-2xl border border-black/5 divide-y divide-black/5 overflow-hidden">
          {MOTION_OPTIONS.map((opt) => {
            const active = motion === opt.value
            return (
              <button
                key={opt.value}
                onClick={() => setMotion(opt.value)}
                className="w-full flex items-start gap-3 px-4 py-3.5 hover:bg-black/[0.02] transition text-left"
              >
                <span className={`w-5 h-5 rounded-full border-2 shrink-0 mt-0.5 flex items-center justify-center transition ${
                  active ? 'border-terracotta bg-terracotta' : 'border-black/20'
                }`}>
                  {active && <span className="w-2 h-2 rounded-full bg-white" />}
                </span>
                <span className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  active ? 'bg-terracotta/10 text-terracotta' : 'bg-black/[0.04] text-ink/60'
                }`}>
                  <opt.icon size={16} strokeWidth={2} />
                </span>
                <div className="flex-1 min-w-0">
                  <p className={`font-medium text-[15px] leading-tight ${active ? 'text-terracotta' : ''}`}>{opt.label}</p>
                  <p className="text-xs text-ink/55 mt-0.5 leading-relaxed">{opt.description}</p>
                </div>
              </button>
            )
          })}
        </div>
      </Section>

      {/* Backup */}
      <Section title="Backup & Daten">
        <div className="bg-white rounded-2xl border border-black/5 p-5 space-y-4">
          <div>
            <p className="font-medium text-[15px] leading-tight">Export</p>
            <p className="text-xs text-ink/55 mt-1 leading-relaxed">
              JSON-Datei mit allen Rezepten, Wochenplänen, Vorrat, Einkaufsliste und Einstellungen.
              Lokaler Download, nichts wird irgendwo hochgeladen.
            </p>
            <button
              onClick={handleExport}
              className="mt-3 inline-flex items-center gap-2 bg-terracotta text-cream font-medium text-sm px-4 py-2 rounded-xl hover:brightness-95 transition"
            >
              <Download size={14} /> Backup herunterladen
            </button>
          </div>
          <div className="pt-4 border-t border-black/5">
            <p className="font-medium text-[15px] leading-tight">Import</p>
            <p className="text-xs text-ink/55 mt-1 leading-relaxed">
              Backup-Datei einlesen. Du kannst danach wählen, ob deine aktuellen Daten ersetzt oder gemerged werden.
            </p>
            <input
              type="file"
              ref={fileRef}
              onChange={handleFile}
              accept="application/json,.json"
              className="hidden"
            />
            <button
              onClick={() => fileRef.current?.click()}
              className="mt-3 inline-flex items-center gap-2 bg-white border border-black/10 text-ink/75 font-medium text-sm px-4 py-2 rounded-xl hover:bg-black/[0.03] transition"
            >
              <Upload size={14} /> Datei auswählen …
            </button>
          </div>
        </div>
      </Section>

      {importPreview && <ImportDialog preview={importPreview} onConfirm={confirmImport} onCancel={() => setImportPreview(null)} />}

      <Section title="Über">
        <div className="bg-white rounded-2xl border border-black/5 p-5">
          <p className="font-medium">Mila 0.2</p>
          <p className="text-xs text-ink/55 mt-1">
            Private Ernährungs- und Mealprep-App für Familie Armborst. Läuft lokal im Browser, keine Cloud.
          </p>
          <div className="flex flex-wrap gap-4 text-xs text-ink/45 mt-3">
            <span>React + Vite</span>
            <span>Dexie (IndexedDB)</span>
            <span>Three.js · Matter.js</span>
            <span>Tailwind v4</span>
          </div>
        </div>
      </Section>
    </div>
  )
}

function Section({ title, subtitle, children }) {
  return (
    <section>
      <div className="mb-3 px-1">
        <h2 className="text-[11px] uppercase tracking-[0.15em] text-ink/50 font-semibold">{title}</h2>
        {subtitle && <p className="text-xs text-ink/55 mt-1.5 leading-relaxed">{subtitle}</p>}
      </div>
      {children}
    </section>
  )
}

function ImportDialog({ preview, onConfirm, onCancel }) {
  const counts = sumObj(preview.data)
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        aria-label="Schließen"
        onClick={onCancel}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      />
      <div className="relative bg-cream rounded-2xl shadow-2xl max-w-md w-full border border-black/10 overflow-hidden">
        <div className="p-5 bg-amber-50 border-b border-amber-200 flex items-start gap-3">
          <span className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <AlertTriangle size={18} strokeWidth={2.2} />
          </span>
          <div>
            <p className="font-semibold leading-tight">Backup importieren</p>
            <p className="text-xs text-ink/65 mt-1 leading-relaxed">
              Exportdatum: {new Date(preview.backup.exportedAt).toLocaleString('de-DE')}
            </p>
          </div>
        </div>

        <div className="p-5 space-y-3">
          <div className="bg-white rounded-xl border border-black/5 p-3 space-y-1 text-sm">
            <Row label="Rezepte" value={counts.recipes} />
            <Row label="Wochenpläne" value={counts.mealplan} />
            <Row label="Vorrat" value={counts.pantry} />
            <Row label="Einkauf" value={counts.shopping} />
            <Row label="Settings" value={counts.settings} />
          </div>

          <div className="space-y-2 pt-1">
            <button
              onClick={() => onConfirm('merge')}
              className="w-full flex items-start gap-3 px-4 py-3 bg-white hover:bg-black/[0.02] border border-black/10 rounded-xl transition text-left"
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium text-[14px] leading-tight">Zusammenführen</p>
                <p className="text-xs text-ink/55 mt-0.5 leading-relaxed">
                  Vorhandene Einträge mit gleicher ID überschreiben, neue hinzufügen. Lokale Daten bleiben erhalten.
                </p>
              </div>
            </button>
            <button
              onClick={() => onConfirm('replace')}
              className="w-full flex items-start gap-3 px-4 py-3 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl transition text-left"
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium text-[14px] leading-tight text-red-900">Komplett ersetzen</p>
                <p className="text-xs text-red-900/70 mt-0.5 leading-relaxed">
                  Alle lokalen Daten löschen, dann Backup einspielen. Nicht rückgängig machbar.
                </p>
              </div>
            </button>
          </div>

          <button
            onClick={onCancel}
            className="w-full text-center text-sm text-ink/60 hover:text-ink py-2"
          >
            Abbrechen
          </button>
        </div>
      </div>
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between">
      <span className="text-ink/55">{label}</span>
      <span className="font-medium tabular-nums">{value}</span>
    </div>
  )
}

function sum(data) {
  return (data?.recipes?.length ?? 0) + (data?.mealplan?.length ?? 0) + (data?.pantry?.length ?? 0) + (data?.shopping?.length ?? 0) + (data?.settings?.length ?? 0)
}

function sumObj(data) {
  return {
    recipes: data?.recipes?.length ?? 0,
    mealplan: data?.mealplan?.length ?? 0,
    pantry: data?.pantry?.length ?? 0,
    shopping: data?.shopping?.length ?? 0,
    settings: data?.settings?.length ?? 0,
  }
}
