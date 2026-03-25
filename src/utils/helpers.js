/**
 * Generate a UUID v4
 */
export function generateId() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

/**
 * Format an ISO date string to a human-readable Swedish date.
 */
export function formatDate(isoString) {
  if (!isoString) return ''
  return new Date(isoString).toLocaleDateString('sv-SE', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

/**
 * Format an ISO date string to date + time.
 */
export function formatDateTime(isoString) {
  if (!isoString) return ''
  return new Date(isoString).toLocaleString('sv-SE', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Copy text to clipboard. Returns a promise.
 */
export async function copyToClipboard(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text)
    return
  }
  // Fallback for older browsers
  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.style.cssText = 'position:fixed;opacity:0'
  document.body.appendChild(textarea)
  textarea.select()
  document.execCommand('copy')
  document.body.removeChild(textarea)
}

/**
 * Download text as a file.
 */
export function downloadFile(content, filename) {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

/**
 * Slugify a title for use as a filename.
 */
export function slugify(title) {
  return title
    .toLowerCase()
    .replace(/[åä]/g, 'a')
    .replace(/ö/g, 'o')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

/**
 * Get the latest version object from a skill.
 */
export function getLatestVersion(skill) {
  if (!skill.versions?.length) return null
  return skill.versions.reduce((a, b) => (a.version > b.version ? a : b))
}

/**
 * Parse a comma-separated tag string into an array of trimmed, lowercase tags.
 */
export function parseTags(tagString) {
  return tagString
    .split(',')
    .map(t => t.trim().toLowerCase())
    .filter(Boolean)
}

/**
 * Simple text search: returns true if query matches title or description.
 */
export function matchesSearch(skill, query) {
  if (!query) return true
  const q = query.toLowerCase()
  return (
    skill.title.toLowerCase().includes(q) ||
    skill.description.toLowerCase().includes(q) ||
    skill.author.toLowerCase().includes(q) ||
    skill.tags?.some(t => t.toLowerCase().includes(q))
  )
}
