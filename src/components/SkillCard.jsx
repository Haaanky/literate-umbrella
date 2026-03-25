import TypeBadge from './TypeBadge.jsx'
import { formatDate, getLatestVersion } from '../utils/helpers.js'

export default function SkillCard({ skill, onClick }) {
  const latest = getLatestVersion(skill)
  const versionCount = skill.versions?.length ?? 0

  return (
    <article className="skill-card" onClick={() => onClick(skill)} role="button" tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick(skill)}>

      <div className="skill-card-header">
        <h3 className="skill-card-title">{skill.title}</h3>
        <TypeBadge type={skill.type} />
      </div>

      <p className="skill-card-desc">
        {skill.description.length > 120
          ? skill.description.slice(0, 120) + '…'
          : skill.description}
      </p>

      {skill.tags?.length > 0 && (
        <div className="tags-row">
          {skill.tags.slice(0, 5).map(tag => (
            <span key={tag} className="tag">#{tag}</span>
          ))}
          {skill.tags.length > 5 && (
            <span className="tag">+{skill.tags.length - 5}</span>
          )}
        </div>
      )}

      <div className="skill-card-footer">
        <div className="skill-card-meta">
          <span>👤 {skill.author}</span>
          <span>📅 {formatDate(skill.updated_at || skill.created_at)}</span>
        </div>
        <div className="skill-card-meta" style={{ textAlign: 'right' }}>
          {versionCount > 1 && (
            <span>v{latest?.version} ({versionCount} versioner)</span>
          )}
          {versionCount <= 1 && latest && (
            <span>v{latest.version}</span>
          )}
        </div>
      </div>
    </article>
  )
}
