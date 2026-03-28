import { ALL_TYPES, TYPE_LABELS } from '../config.js'

export const SORT_OPTIONS = [
  { value: 'updated_desc', label: 'Nyast uppdaterad' },
  { value: 'created_desc', label: 'Nyast tillagd' },
  { value: 'created_asc', label: 'Äldst tillagd' },
  { value: 'az', label: 'A–Ö' },
]

export default function SearchFilter({
  query, setQuery,
  typeFilter, setTypeFilter,
  tagFilter, setTagFilter,
  sort, setSort,
  allTags,
  totalCount, filteredCount,
}) {
  return (
    <div>
      <div className="search-bar">
        <div className="search-input-wrap">
          <span className="search-icon">🔍</span>
          <input
            className="search-input"
            type="text"
            placeholder="Sök på titel, beskrivning, taggar eller upphovsman…"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>

        <select
          className="filter-select"
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
        >
          <option value="">Alla typer</option>
          {ALL_TYPES.map(t => (
            <option key={t} value={t}>{TYPE_LABELS[t]}</option>
          ))}
        </select>

        <select
          className="filter-select"
          value={sort}
          onChange={e => setSort(e.target.value)}
        >
          {SORT_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {allTags.length > 0 && (
        <div className="tag-filter-wrap" style={{ marginBottom: '1rem' }}>
          <span className="text-sm text-muted">Taggar:</span>
          {allTags.map(tag => (
            <button
              key={tag}
              className={`tag-chip ${tagFilter === tag ? 'active' : ''}`}
              onClick={() => setTagFilter(tagFilter === tag ? '' : tag)}
            >
              #{tag}
            </button>
          ))}
        </div>
      )}

      <p className="results-info">
        {filteredCount === totalCount
          ? `${totalCount} skill${totalCount !== 1 ? 's' : ''}`
          : `Visar ${filteredCount} av ${totalCount} skills`}
      </p>
    </div>
  )
}
