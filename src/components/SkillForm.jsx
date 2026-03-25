import { useState } from 'react'
import TypeBadge from './TypeBadge.jsx'
import { ALL_TYPES, TYPE_LABELS } from '../config.js'
import { generateId, parseTags, getLatestVersion } from '../utils/helpers.js'

const EMPTY_FORM = {
  title: '',
  type: 'prompt',
  description: '',
  author: '',
  tags: '',
  content: '',
}

function formFromSkill(skill) {
  const latest = getLatestVersion(skill)
  return {
    title: skill.title,
    type: skill.type,
    description: skill.description,
    author: skill.author,
    tags: skill.tags?.join(', ') ?? '',
    content: latest?.content ?? '',
  }
}

export default function SkillForm({ skill, onSave, onClose, saving }) {
  const isEdit = Boolean(skill)
  const [form, setForm] = useState(isEdit ? formFromSkill(skill) : EMPTY_FORM)
  const [error, setError] = useState(null)

  function set(field, value) {
    setForm(f => ({ ...f, [field]: value }))
  }

  function validate() {
    if (!form.title.trim()) return 'Titel krävs.'
    if (!form.author.trim()) return 'Upphovsman krävs.'
    if (!form.content.trim()) return 'Innehåll krävs.'
    return null
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const err = validate()
    if (err) { setError(err); return }
    setError(null)

    const now = new Date().toISOString()
    const tags = parseTags(form.tags)

    let updatedSkill
    if (isEdit) {
      const prevVersions = skill.versions ?? []
      const nextVersion = (getLatestVersion(skill)?.version ?? 0) + 1
      const latestContent = getLatestVersion(skill)?.content
      // Only create a new version if content actually changed
      const contentChanged = latestContent !== form.content
      const newVersions = contentChanged
        ? [...prevVersions, { version: nextVersion, updated_at: now, content: form.content }]
        : prevVersions

      updatedSkill = {
        ...skill,
        title: form.title,
        type: form.type,
        description: form.description,
        author: form.author,
        tags,
        updated_at: now,
        versions: newVersions,
      }
    } else {
      updatedSkill = {
        id: generateId(),
        title: form.title,
        type: form.type,
        description: form.description,
        author: form.author,
        tags,
        created_at: now,
        updated_at: now,
        versions: [{ version: 1, updated_at: now, content: form.content }],
      }
    }

    await onSave(updatedSkill)
  }

  return (
    <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal modal-md">
        <div className="modal-header">
          <h2>{isEdit ? `Redigera: ${skill.title}` : 'Lägg till ny skill'}</h2>
          <button className="btn btn-ghost btn-icon btn-sm" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && (
              <div className="error-banner">
                <span className="error-icon">⚠️</span>
                {error}
              </div>
            )}

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  Titel <span className="required">*</span>
                </label>
                <input
                  className="form-input"
                  value={form.title}
                  onChange={e => set('title', e.target.value)}
                  placeholder="T.ex. Senior C# Assistent"
                  maxLength={120}
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Upphovsman <span className="required">*</span>
                </label>
                <input
                  className="form-input"
                  value={form.author}
                  onChange={e => set('author', e.target.value)}
                  placeholder="Ditt namn"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                Typ <span className="required">*</span>
              </label>
              <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap' }}>
                {ALL_TYPES.map(t => (
                  <button
                    key={t}
                    type="button"
                    className={`btn ${form.type === t ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                    onClick={() => set('type', t)}
                  >
                    {TYPE_LABELS[t]}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Beskrivning</label>
              <input
                className="form-input"
                value={form.description}
                onChange={e => set('description', e.target.value)}
                placeholder="Kort beskrivning av vad skillen gör"
                maxLength={300}
              />
              <span className="char-count">{form.description.length}/300</span>
            </div>

            <div className="form-group">
              <label className="form-label">Taggar</label>
              <input
                className="form-input"
                value={form.tags}
                onChange={e => set('tags', e.target.value)}
                placeholder="c#, kodning, arkitektur (kommaseparerade)"
              />
              <span className="form-hint">Separera taggar med kommatecken</span>
            </div>

            <div className="form-group">
              <label className="form-label">
                Innehåll <span className="required">*</span>
                {isEdit && (
                  <span className="form-hint" style={{ marginLeft: '.5rem', fontWeight: 400 }}>
                    (om du ändrar detta skapas en ny version)
                  </span>
                )}
              </label>
              <textarea
                className="form-textarea large"
                value={form.content}
                onChange={e => set('content', e.target.value)}
                placeholder="Skriv eller klistra in din prompt, system prompt, SKILL.md eller workflow här…"
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={saving}>
              Avbryt
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? '⏳ Sparar…' : isEdit ? '💾 Spara ändringar' : '✅ Lägg till skill'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
