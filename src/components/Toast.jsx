import { useEffect } from 'react'

export default function Toast({ toasts, onRemove }) {
  return (
    <div className="toast-container">
      {toasts.map(t => (
        <ToastItem key={t.id} toast={t} onRemove={onRemove} />
      ))}
    </div>
  )
}

function ToastItem({ toast, onRemove }) {
  useEffect(() => {
    const timer = setTimeout(() => onRemove(toast.id), toast.duration ?? 3500)
    return () => clearTimeout(timer)
  }, [toast.id, toast.duration, onRemove])

  return (
    <div className={`toast ${toast.type ?? ''}`} onClick={() => onRemove(toast.id)}>
      <span>
        {toast.type === 'success' && '✅ '}
        {toast.type === 'error' && '❌ '}
      </span>
      {toast.message}
    </div>
  )
}
