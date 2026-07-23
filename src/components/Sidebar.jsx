const items = [
  ['inicio', '⌂', 'Inicio'],
  ['clientes', '◎', 'Clientes'],
  ['recordatorios', '◷', 'Recordatorios'],
  ['configuracion', '⚙', 'Configuración'],
  ['diagnostico', '◇', 'Diagnóstico'],
]

export default function Sidebar({ active, onSelect, open, onClose }) {
  return (
    <aside className={`sidebar ${open ? 'sidebar-open' : ''}`}>
      <div className="sidebar-brand">
        <div className="brand-mark">RC</div>
        <div>
          <strong>Rafiki Chatbot</strong>
          <span>Panel administrativo</span>
        </div>
      </div>

      <nav className="nav-list">
        {items.map(([key, icon, label]) => (
          <button
            key={key}
            className={`nav-item ${active === key ? 'active' : ''}`}
            onClick={() => {
              onSelect(key)
              onClose?.()
            }}
          >
            <span className="nav-icon">{icon}</span>
            <span>{label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <span>Fase 1B</span>
        <strong>v0.2.0</strong>
      </div>
    </aside>
  )
}
