import { useState } from 'react'

export default function SettingsModal({ pat, onSave, onClose }) {
  const [value, setValue] = useState(pat ?? '')
  const [show, setShow] = useState(false)

  function handleSave() {
    onSave(value.trim())
    onClose()
  }

  function handleClear() {
    setValue('')
    onSave('')
    onClose()
  }

  return (
    <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal modal-sm">
        <div className="modal-header">
          <h2>⚙️ Inställningar</h2>
          <button className="btn btn-ghost btn-icon btn-sm" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <div className="settings-info">
            <strong>GitHub Personal Access Token (PAT)</strong>
            <p style={{ marginTop: '.4rem' }}>
              Krävs för att lägga till och redigera skills. Tokenet sparas
              endast i webbläsarens sessionStorage och raderas automatiskt när
              du stänger fliken.
            </p>
            <p style={{ marginTop: '.5rem' }}>
              Skapa ett token på{' '}
              <a href="https://github.com/settings/tokens" target="_blank" rel="noreferrer">
                github.com/settings/tokens
              </a>{' '}
              med scope <strong>repo</strong> (eller <strong>contents:write</strong> för fine-grained token).
            </p>
          </div>

          <div className="form-group">
            <label className="form-label">GitHub PAT</label>
            <div className="pat-input-wrap">
              <input
                className="form-input"
                type={show ? 'text' : 'password'}
                value={value}
                onChange={e => setValue(e.target.value)}
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                autoComplete="off"
              />
              <button
                className="pat-toggle"
                type="button"
                onClick={() => setShow(s => !s)}
                aria-label={show ? 'Dölj token' : 'Visa token'}
              >
                {show ? '🙈' : '👁️'}
              </button>
            </div>
            <span className="form-hint">
              Lämna tomt om du bara vill läsa skills utan att redigera.
            </span>
          </div>

          {pat && (
            <div style={{ marginTop: '.5rem' }}>
              <span className="pat-status set">✅ PAT är inställt</span>
            </div>
          )}
        </div>

        <div className="modal-footer">
          {pat && (
            <button className="btn btn-danger btn-sm" onClick={handleClear}>
              🗑️ Rensa PAT
            </button>
          )}
          <button className="btn btn-secondary" onClick={onClose}>Avbryt</button>
          <button className="btn btn-primary" onClick={handleSave}>Spara</button>
        </div>
      </div>
    </div>
  )
}
