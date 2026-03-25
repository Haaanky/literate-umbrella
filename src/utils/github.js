import { GITHUB_OWNER, GITHUB_REPO, GITHUB_BRANCH, DATA_PATH } from '../config.js'

const API_BASE = 'https://api.github.com'

function apiHeaders(pat = null) {
  const headers = {
    'Accept': 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  }
  if (pat) headers['Authorization'] = `Bearer ${pat}`
  return headers
}

/**
 * Fetch skills.json from GitHub API.
 * Returns { skills: Array, sha: string }
 */
export async function fetchSkills(pat = null) {
  const url = `${API_BASE}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${DATA_PATH}?ref=${GITHUB_BRANCH}`
  const res = await fetch(url, { headers: apiHeaders(pat) })

  if (!res.ok) {
    if (res.status === 404) return { skills: [], sha: null }
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message || `GitHub API error ${res.status}`)
  }

  const data = await res.json()
  // content is base64-encoded
  const decoded = decodeBase64Unicode(data.content)
  return { skills: JSON.parse(decoded), sha: data.sha }
}

/**
 * Write skills array to GitHub via API.
 * sha is required for updates (null only if file doesn't exist yet).
 */
export async function saveSkills(skills, pat, sha, commitMessage = 'Update skills data') {
  if (!pat) throw new Error('GitHub PAT krävs för att spara data.')

  const content = encodeBase64Unicode(JSON.stringify(skills, null, 2))
  const body = { message: commitMessage, content, branch: GITHUB_BRANCH }
  if (sha) body.sha = sha

  const url = `${API_BASE}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${DATA_PATH}`
  const res = await fetch(url, {
    method: 'PUT',
    headers: { ...apiHeaders(pat), 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    if (res.status === 409) {
      throw new Error('Konflikt: filen har ändrats av någon annan. Ladda om sidan och försök igen.')
    }
    if (res.status === 401) {
      throw new Error('Ogiltigt PAT. Kontrollera token i Inställningar.')
    }
    if (res.status === 403) {
      throw new Error('Saknar behörighet. Kontrollera att PAT har repo-scope.')
    }
    throw new Error(err.message || `GitHub API error ${res.status}`)
  }

  const result = await res.json()
  return result.content.sha
}

// --- Helpers for Unicode-safe base64 ---

function encodeBase64Unicode(str) {
  return btoa(
    encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) =>
      String.fromCharCode('0x' + p1)
    )
  )
}

function decodeBase64Unicode(str) {
  // GitHub adds newlines in base64; strip them
  const clean = str.replace(/\n/g, '')
  return decodeURIComponent(
    atob(clean)
      .split('')
      .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  )
}
