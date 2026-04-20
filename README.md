# Mila

Ernährungs- und Mealprep-App der Familie Armborst. PWA, läuft lokal – später GitHub Pages.

## Entwickeln

```bash
npm install
npm run dev
```

Öffnet auf `http://localhost:5173`.

## Stack

- **React 18** + **Vite 6** — UI & Build
- **Tailwind CSS v4** — Styling via `@tailwindcss/vite`
- **React Router** — HashRouter (funktioniert ohne Server-Rewrites auf GitHub Pages)
- **Dexie.js** + `dexie-react-hooks` — IndexedDB-Persistenz (ab M2)
- **lucide-react** — Icons

## Milestones

- **M1 · Grundgerüst + Home** ✅ Layout, Navigation, Home mit Mock-Daten
- **M2 · DB + Rezepte** Dexie-Schema, Seed, Rezept-CRUD
- **M3 · Wochenplan** Mo–So-Grid, Zuweisung
- **M4 · Einkaufsliste** Manuell + aus Wochenplan
- **M5 · Vorrat** Kühl/Freezer/Vorrat-Tabs, Ablauf-Logic
- **M6 · PWA + Deploy** Service Worker, Dark Mode, GitHub Pages
