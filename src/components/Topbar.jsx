export default function Topbar({ title, subtitle, onMenu, user, onLogout, installationMode }) {
  return (
    <header className="topbar">
      <div className="topbar-title-wrap">
        <button className="menu-button" onClick={onMenu} aria-label="Abrir menú">☰</button>
        <div>
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>
      </div>
      <div className="topbar-actions">
        {installationMode && <span className="install-chip">Modo instalación</span>}
        <div className="user-pill">
          <span className="avatar">A</span>
          <div>
            <strong>Administrador</strong>
            <span>{user?.email || 'Configuración inicial'}</span>
          </div>
        </div>
        {user && <button className="ghost-button" onClick={onLogout}>Salir</button>}
      </div>
    </header>
  )
}
