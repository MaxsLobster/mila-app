import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App.jsx'
import { ToastProvider } from './components/ui/Toast'
import { MotionProvider } from './lib/motion.jsx'
import { seedIfEmpty } from './db/seed'
import './styles/index.css'

// Background tasks kick off, UI renders immediately
seedIfEmpty().catch((err) => console.error('Seed failed:', err))

// Register service worker in production only
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  import('virtual:pwa-register').then(({ registerSW }) => {
    registerSW({ immediate: true })
  }).catch(() => { /* plugin missing in some build contexts */ })
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <MotionProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </MotionProvider>
    </HashRouter>
  </StrictMode>
)
