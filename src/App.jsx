import { Routes, Route, Navigate } from 'react-router-dom'
import AppShell from './components/layout/AppShell'
import Home from './routes/Home'
import Woche from './routes/Woche'
import Rezepte from './routes/Rezepte'
import Einkauf from './routes/Einkauf'
import Vorrat from './routes/Vorrat'
import SettingsView from './routes/Settings'

export default function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/woche" element={<Woche />} />
        <Route path="/rezepte" element={<Rezepte />} />
        <Route path="/einkauf" element={<Einkauf />} />
        <Route path="/vorrat" element={<Vorrat />} />
        <Route path="/settings" element={<SettingsView />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  )
}
