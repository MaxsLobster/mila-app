import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App.jsx'
import { ToastProvider } from './components/ui/Toast'
import { seedIfEmpty } from './db/seed'
import './styles/index.css'

seedIfEmpty().catch((err) => console.error('Seed failed:', err))

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <ToastProvider>
        <App />
      </ToastProvider>
    </HashRouter>
  </StrictMode>
)
