import { useState, useEffect, useCallback } from 'react'
import Header from './components/Header.jsx'
import SkillList from './components/SkillList.jsx'
import SkillDetail from './components/SkillDetail.jsx'
import SkillForm from './components/SkillForm.jsx'
import SettingsModal from './components/SettingsModal.jsx'
import Toast from './components/Toast.jsx'
import { fetchSkills, saveSkills } from './utils/github.js'

// ─── PAT storage ───────────────────────────────────────────────────────────
function loadPat() {
  try { return sessionStorage.getItem('ai-skills-hub:pat') ?? '' }
  catch { return '' }
}
function storePat(pat) {
  try {
    if (pat) sessionStorage.setItem('ai-skills-hub:pat', pat)
    else sessionStorage.removeItem('ai-skills-hub:pat')
  } catch {}
}

// ─── Toast helpers ─────────────────────────────────────────────────────────
let _toastId = 0
function makeToast(message, type = '') {
  return { id: ++_toastId, message, type }
}

export default function App() {
  const [skills, setSkills] = useState([])
  const [sha, setSha] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(null)
  const [saving, setSaving] = useState(false)

  // Views: 'list' | 'detail' | 'form'
  const [view, setView] = useState('list')
  const [selectedSkill, setSelectedSkill] = useState(null)
  const [editingSkill, setEditingSkill] = useState(null) // null = new

  const [showSettings, setShowSettings] = useState(false)
  const [pat, setPat] = useState(loadPat)
  const [toasts, setToasts] = useState([])

  // Search/filter state
  const [query, setQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [tagFilter, setTagFilter] = useState('')

  // ─── Load skills ─────────────────────────────────────────────────────────
  const loadData = useCallback(async () => {
    setLoading(true)
    setLoadError(null)
    try {
      const { skills: data, sha: fileSha } = await fetchSkills(pat || null)
      setSkills(data)
      setSha(fileSha)
    } catch (err) {
      setLoadError(err.message)
    } finally {
      setLoading(false)
    }
  }, [pat])

  useEffect(() => { loadData() }, [loadData])

  // ─── Toast ───────────────────────────────────────────────────────────────
  function addToast(message, type = '') {
    setToasts(ts => [...ts, makeToast(message, type)])
  }
  function removeToast(id) {
    setToasts(ts => ts.filter(t => t.id !== id))
  }

  // ─── PAT ─────────────────────────────────────────────────────────────────
  function handleSavePat(newPat) {
    setPat(newPat)
    storePat(newPat)
    if (newPat) addToast('PAT sparat för sessionen.', 'success')
    else addToast('PAT rensat.', '')
  }

  // ─── Navigation ──────────────────────────────────────────────────────────
  function handleSelectSkill(skill) {
    setSelectedSkill(skill)
    setView('detail')
  }

  function handleCloseDetail() {
    setSelectedSkill(null)
    setView('list')
  }

  function handleAddSkill() {
    if (!pat) {
      setShowSettings(true)
      addToast('Sätt ett GitHub PAT för att kunna lägga till skills.', 'error')
      return
    }
    setEditingSkill(null)
    setView('form')
  }

  function handleEditSkill(skill) {
    if (!pat) {
      setShowSettings(true)
      return
    }
    setEditingSkill(skill)
    setSelectedSkill(null)
    setView('form')
  }

  function handleCloseForm() {
    setEditingSkill(null)
    setView(selectedSkill ? 'detail' : 'list')
  }

  // ─── Save skill ──────────────────────────────────────────────────────────
  async function handleSaveSkill(updatedSkill) {
    setSaving(true)
    try {
      // Fetch latest SHA to avoid conflicts
      const { skills: freshSkills, sha: freshSha } = await fetchSkills(pat)

      let newSkills
      const existingIdx = freshSkills.findIndex(s => s.id === updatedSkill.id)
      if (existingIdx >= 0) {
        newSkills = freshSkills.map((s, i) => i === existingIdx ? updatedSkill : s)
      } else {
        newSkills = [...freshSkills, updatedSkill]
      }

      const commitMsg = existingIdx >= 0
        ? `Update skill: ${updatedSkill.title}`
        : `Add skill: ${updatedSkill.title}`

      const newSha = await saveSkills(newSkills, pat, freshSha, commitMsg)
      setSkills(newSkills)
      setSha(newSha)

      addToast(
        existingIdx >= 0
          ? `"${updatedSkill.title}" uppdaterades!`
          : `"${updatedSkill.title}" lades till!`,
        'success'
      )
      setEditingSkill(null)
      setView('list')
    } catch (err) {
      addToast(err.message, 'error')
    } finally {
      setSaving(false)
    }
  }

  // ─── Render ──────────────────────────────────────────────────────────────
  return (
    <div className="app">
      <Header pat={pat} onAddSkill={handleAddSkill} onOpenSettings={() => setShowSettings(true)} />

      <main className="main">
        {loading && (
          <div className="loading-wrap">
            <div className="spinner" />
          </div>
        )}

        {!loading && loadError && (
          <div className="error-banner">
            <span className="error-icon">⚠️</span>
            <div>
              <strong>Kunde inte ladda skills:</strong> {loadError}
              <br />
              <button className="btn btn-secondary btn-sm" style={{ marginTop: '.5rem' }} onClick={loadData}>
                Försök igen
              </button>
            </div>
          </div>
        )}

        {!loading && !loadError && (
          <SkillList
            skills={skills}
            onSelectSkill={handleSelectSkill}
            onAddSkill={handleAddSkill}
            query={query} setQuery={setQuery}
            typeFilter={typeFilter} setTypeFilter={setTypeFilter}
            tagFilter={tagFilter} setTagFilter={setTagFilter}
          />
        )}
      </main>

      {/* Modals */}
      {view === 'detail' && selectedSkill && (
        <SkillDetail
          skill={selectedSkill}
          pat={pat}
          onClose={handleCloseDetail}
          onEdit={handleEditSkill}
        />
      )}

      {view === 'form' && (
        <SkillForm
          skill={editingSkill}
          onSave={handleSaveSkill}
          onClose={handleCloseForm}
          saving={saving}
        />
      )}

      {showSettings && (
        <SettingsModal
          pat={pat}
          onSave={handleSavePat}
          onClose={() => setShowSettings(false)}
        />
      )}

      <Toast toasts={toasts} onRemove={removeToast} />
    </div>
  )
}
