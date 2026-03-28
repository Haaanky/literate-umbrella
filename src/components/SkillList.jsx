import SkillCard from './SkillCard.jsx'
import SearchFilter from './SearchFilter.jsx'
import { matchesSearch } from '../utils/helpers.js'
import { useMemo } from 'react'

function applySorting(skills, sort) {
  const arr = [...skills]
  if (sort === 'updated_desc') return arr.sort((a, b) => (b.updated_at ?? '') > (a.updated_at ?? '') ? 1 : -1)
  if (sort === 'created_desc') return arr.sort((a, b) => (b.created_at ?? '') > (a.created_at ?? '') ? 1 : -1)
  if (sort === 'created_asc') return arr.sort((a, b) => (a.created_at ?? '') > (b.created_at ?? '') ? 1 : -1)
  if (sort === 'az') return arr.sort((a, b) => a.title.localeCompare(b.title, 'sv'))
  return arr
}

export default function SkillList({
  skills, onSelectSkill, onAddSkill,
  query, setQuery,
  typeFilter, setTypeFilter,
  tagFilter, setTagFilter,
  sort, setSort,
}) {
  const allTags = useMemo(() => {
    const tagSet = new Set()
    skills.forEach(s => s.tags?.forEach(t => tagSet.add(t)))
    return Array.from(tagSet).sort()
  }, [skills])

  const filtered = useMemo(() => {
    const base = skills.filter(s => {
      if (typeFilter && s.type !== typeFilter) return false
      if (tagFilter && !s.tags?.includes(tagFilter)) return false
      if (!matchesSearch(s, query)) return false
      return true
    })
    return applySorting(base, sort)
  }, [skills, query, typeFilter, tagFilter, sort])

  return (
    <div>
      <SearchFilter
        query={query} setQuery={setQuery}
        typeFilter={typeFilter} setTypeFilter={setTypeFilter}
        tagFilter={tagFilter} setTagFilter={setTagFilter}
        sort={sort} setSort={setSort}
        allTags={allTags}
        totalCount={skills.length}
        filteredCount={filtered.length}
      />

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            {skills.length === 0 ? '📭' : '🔍'}
          </div>
          <h3>
            {skills.length === 0
              ? 'Inga skills ännu'
              : 'Inga skills matchar sökningen'}
          </h3>
          <p>
            {skills.length === 0
              ? 'Lägg till din första skill för att komma igång!'
              : 'Prova att ändra sökterm eller filter.'}
          </p>
          {skills.length === 0 && (
            <button className="btn btn-primary" onClick={onAddSkill}>
              + Lägg till skill
            </button>
          )}
        </div>
      ) : (
        <div className="skills-grid">
          {filtered.map(skill => (
            <SkillCard key={skill.id} skill={skill} onClick={onSelectSkill} />
          ))}
        </div>
      )}
    </div>
  )
}
