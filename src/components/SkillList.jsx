import SkillCard from './SkillCard.jsx'
import SearchFilter from './SearchFilter.jsx'
import { matchesSearch } from '../utils/helpers.js'
import { useMemo } from 'react'

export default function SkillList({
  skills, onSelectSkill, onAddSkill,
  query, setQuery,
  typeFilter, setTypeFilter,
  tagFilter, setTagFilter,
}) {
  const allTags = useMemo(() => {
    const tagSet = new Set()
    skills.forEach(s => s.tags?.forEach(t => tagSet.add(t)))
    return Array.from(tagSet).sort()
  }, [skills])

  const filtered = useMemo(() => {
    return skills.filter(s => {
      if (typeFilter && s.type !== typeFilter) return false
      if (tagFilter && !s.tags?.includes(tagFilter)) return false
      if (!matchesSearch(s, query)) return false
      return true
    })
  }, [skills, query, typeFilter, tagFilter])

  return (
    <div>
      <SearchFilter
        query={query} setQuery={setQuery}
        typeFilter={typeFilter} setTypeFilter={setTypeFilter}
        tagFilter={tagFilter} setTagFilter={setTagFilter}
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
