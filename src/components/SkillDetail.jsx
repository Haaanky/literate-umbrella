import { useState } from 'react'
import TypeBadge from './TypeBadge.jsx'
import { formatDate, formatDateTime, copyToClipboard, downloadFile, slugify } from '../utils/helpers.js'

export default function SkillDetail({ skill, pat, onClose, onEdit, onDelete, onDuplicate }) {
  const sortedVersions = [...(skill.versions ?? [])].sort((a, b) => b.version - a.version)
  const latestVersion = sortedVersions[0]
  const [activeVersion, setActiveVersion] = useState(latestVersion)
  const [copied, setCopied] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  async function handleCopy() {
    await copyToClipboard(activeVersion.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handleDownloadMd() {
    downloadFile(activeVersion.content, `${slugify(skill.title)}.md`)
  }

  function handleDownloadTxt() {
    downloadFile(activeVersion.content, `${slugify(skill.title)}.txt`)
  }

  return (
    <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal modal-lg">
        <div className="modal-header">
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '.6rem', marginBottom: '.4rem', flexWrap: 'wrap' }}>
              <TypeBadge type={skill.type} />
              {skill.tags?.slice(0, 4).map(tag => (
                <span key={tag} className="tag">#{tag}</span>
              ))}
            </div>
            <h2>{skill.title}</h2>
          </div>
          <button className="btn btn-ghost btn-icon btn-sm" onClick={onClose} aria-label="Stäng">✕</button>
        </div>

        <div className="modal-body">
          {/* Meta */}
          <div className="skill-detail-meta">
            <div className="skill-detail-meta-item">👤 <strong>{skill.author}</strong></div>
            <div className="skill-detail-meta-item">📅 Skapad {formatDate(skill.created_at)}</div>
            <div className="skill-detail-meta-item">🔄 Uppdaterad {formatDateTime(skill.updated_at)}</div>
          </div>

          <p style={{ fontSize: '.9rem', color: 'var(--text-2)', marginBottom: '1.25rem' }}>
            {skill.description}
          </p>

          {/* Version selector */}
          {sortedVersions.length > 1 && (
            <div className="version-selector">
              <label>Version:</label>
              <div className="version-tabs">
                {sortedVersions.map(v => (
                  <button
                    key={v.version}
                    className={`version-tab ${activeVersion.version === v.version ? 'active' : ''}`}
                    onClick={() => setActiveVersion(v)}
                  >
                    v{v.version}
                    {v.version === latestVersion.version && (
                      <span className="latest-badge">senaste</span>
                    )}
                  </button>
                ))}
              </div>
              <span className="text-sm text-muted">
                {formatDateTime(activeVersion.updated_at)}
              </span>
            </div>
          )}

          {sortedVersions.length === 1 && (
            <p className="text-sm text-muted" style={{ marginBottom: '.75rem' }}>
              v1 · {formatDateTime(activeVersion.updated_at)}
            </p>
          )}

          {/* Content */}
          <pre className="content-block">{activeVersion?.content}</pre>

          {/* Export */}
          <div className="export-actions">
            <button className="btn btn-secondary btn-sm" onClick={handleCopy}>
              {copied ? '✅ Kopierat!' : '📋 Kopiera'}
            </button>
            <button className="btn btn-secondary btn-sm" onClick={handleDownloadMd}>
              ⬇️ .md
            </button>
            <button className="btn btn-secondary btn-sm" onClick={handleDownloadTxt}>
              ⬇️ .txt
            </button>
          </div>
        </div>

        <div className="modal-footer">
          {pat && !confirmDelete && (
            <>
              <button className="btn btn-danger btn-sm" style={{ marginRight: 'auto' }} onClick={() => setConfirmDelete(true)}>
                🗑 Radera
              </button>
              <button className="btn btn-secondary" onClick={() => onDuplicate(skill)}>
                📋 Duplicera
              </button>
              <button className="btn btn-secondary" onClick={() => onEdit(skill)}>
                ✏️ Redigera
              </button>
            </>
          )}
          {pat && confirmDelete && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem', flex: 1, flexWrap: 'wrap' }}>
              <span style={{ fontSize: '.875rem', color: 'var(--danger)', flex: 1 }}>
                Är du säker på att du vill radera <strong>{skill.title}</strong>?
              </span>
              <button className="btn btn-secondary btn-sm" onClick={() => setConfirmDelete(false)}>Avbryt</button>
              <button className="btn btn-danger btn-sm" onClick={() => onDelete(skill)}>Ja, radera</button>
            </div>
          )}
          {!confirmDelete && (
            <button className="btn btn-primary" onClick={onClose}>Stäng</button>
          )}
        </div>
      </div>
    </div>
  )
}
