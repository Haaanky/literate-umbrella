import { TYPE_LABELS, TYPE_COLORS } from '../config.js'

export default function TypeBadge({ type }) {
  const label = TYPE_LABELS[type] ?? type
  const cls = TYPE_COLORS[type] ?? ''
  return <span className={`type-badge ${cls}`}>{label}</span>
}
