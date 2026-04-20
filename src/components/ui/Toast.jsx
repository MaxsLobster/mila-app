import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { Check, Info, AlertCircle, X } from 'lucide-react'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const toast = useCallback((message, options = {}) => {
    const id = crypto.randomUUID()
    const t = {
      id,
      message,
      tone: options.tone ?? 'success',
      duration: options.duration ?? 2500,
      icon: options.icon,
    }
    setToasts((prev) => [...prev, t].slice(-3))
    return id
  }, [])

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

function ToastContainer({ toasts, onDismiss }) {
  return (
    <div className="fixed top-[max(env(safe-area-inset-top),1rem)] left-0 right-0 z-[100] flex flex-col items-center gap-2 px-4 pointer-events-none">
      {toasts.map((t) => (
        <ToastPill key={t.id} toast={t} onDismiss={() => onDismiss(t.id)} />
      ))}
    </div>
  )
}

function ToastPill({ toast, onDismiss }) {
  const [closing, setClosing] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setClosing(true)
      setTimeout(onDismiss, 200)
    }, toast.duration)
    return () => clearTimeout(timer)
  }, [toast.duration, onDismiss])

  const iconMap = {
    success: <Check size={14} strokeWidth={2.8} />,
    info: <Info size={14} strokeWidth={2.8} />,
    error: <AlertCircle size={14} strokeWidth={2.8} />,
  }

  const tones = {
    success: 'bg-sage text-white',
    info: 'bg-ink/85 text-cream',
    error: 'bg-red-600 text-white',
  }

  function handleClose() {
    setClosing(true)
    setTimeout(onDismiss, 200)
  }

  const Icon = toast.icon ?? iconMap[toast.tone] ?? iconMap.info

  return (
    <div
      className={`toast-pill ${closing ? 'toast-closing' : ''} pointer-events-auto`}
      style={{ '--toast-duration': `${toast.duration}ms` }}
    >
      <div
        className={`flex items-center gap-2.5 pl-2 pr-4 py-2 rounded-full shadow-lg shadow-black/15 backdrop-blur-md ${tones[toast.tone] || tones.info}`}
      >
        <span className="relative inline-flex items-center justify-center w-8 h-8 shrink-0">
          <svg className="absolute inset-0 -rotate-90" viewBox="0 0 32 32" width="32" height="32">
            <circle
              cx="16"
              cy="16"
              r="14"
              fill="none"
              stroke="currentColor"
              strokeOpacity="0.25"
              strokeWidth="2"
            />
            <circle
              cx="16"
              cy="16"
              r="14"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="88"
              className="toast-progress"
            />
          </svg>
          <span className="relative">{Icon}</span>
        </span>
        <span className="text-sm font-medium leading-tight">{toast.message}</span>
        <button
          onClick={handleClose}
          className="p-1 -mr-2 opacity-60 hover:opacity-100 transition"
          aria-label="Schließen"
        >
          <X size={13} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  )
}
