export default function Header({ pat, onAddSkill, onOpenSettings }) {
  return (
    <header className="header">
      <div className="header-inner">
        <div className="header-brand">
          <span className="brand-icon">⚡</span>
          <span>AI Skills Hub</span>
        </div>

        <div className="header-actions">
          <button
            className="pat-status text-sm"
            style={{ cursor: 'pointer', border: 'none', background: 'none' }}
            onClick={onOpenSettings}
            title="Inställningar"
          >
            <span className={`pat-status ${pat ? 'set' : 'unset'}`}>
              {pat ? '🔑 PAT aktiv' : '🔒 Sätt PAT'}
            </span>
          </button>

          <button className="btn btn-ghost btn-icon" onClick={onOpenSettings} title="Inställningar">
            ⚙️
          </button>

          <button className="btn btn-primary" onClick={onAddSkill}>
            <span>+</span> Lägg till skill
          </button>
        </div>
      </div>
    </header>
  )
}
