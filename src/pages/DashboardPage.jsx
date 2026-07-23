import StatusBadge from '../components/StatusBadge.jsx'

function Card({ label, value, helper, icon }) {
  return (
    <article className="stat-card">
      <div className="stat-icon">{icon}</div>
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
        <small>{helper}</small>
      </div>
    </article>
  )
}

export default function DashboardPage({ stats, installationMode }) {
  return (
    <div className="page-stack">
      <section className="hero-card">
        <div>
          <span className="eyebrow">Rafiki Chatbot · Fase 1B</span>
          <h2>Base desplegable y lista para pruebas reales.</h2>
          <p>Primero validamos clientes y recordatorios en Firebase; después conectaremos WhatsApp.</p>
        </div>
        <StatusBadge tone={installationMode ? 'warning' : 'success'}>
          {installationMode ? 'Configuración pendiente' : 'Firebase conectado'}
        </StatusBadge>
      </section>

      <section className="stats-grid">
        <Card label="Clientes" value={stats.clientes} helper="Números registrados" icon="◎" />
        <Card label="Activos" value={stats.activos} helper="Clientes habilitados" icon="✓" />
        <Card label="Recordatorios" value={stats.recordatorios} helper="Total registrados" icon="◷" />
        <Card label="Pendientes" value={stats.pendientes} helper="Próximos envíos" icon="→" />
      </section>

      <section className="two-column">
        <article className="panel-card">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Validación 1B</span>
              <h3>Flujo manual antes de WhatsApp</h3>
            </div>
          </div>
          <div className="flow-list">
            {[
              ['1', 'Administrador', 'Inicia sesión con Firebase Authentication.'],
              ['2', 'Cliente', 'Registra manualmente un número con código de país.'],
              ['3', 'Recordatorio', 'Programa una prueba desde el panel.'],
              ['4', 'Diagnóstico', 'Confirma lectura autorizada de Firestore.'],
            ].map(([n, title, text]) => (
              <div className="flow-row" key={n}>
                <span>{n}</span>
                <div><strong>{title}</strong><small>{text}</small></div>
              </div>
            ))}
          </div>
        </article>

        <article className="panel-card">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Estado</span>
              <h3>Fase 1B</h3>
            </div>
          </div>
          <div className="check-list">
            <div><span>✓</span> React + Vite</div>
            <div><span>✓</span> Firebase Authentication validado por perfil admin</div>
            <div><span>✓</span> Firestore + reglas de seguridad</div>
            <div><span>✓</span> Alta manual de clientes</div>
            <div><span>✓</span> Alta manual de recordatorios</div>
            <div><span>✓</span> Diagnóstico real de Firestore</div>
          </div>
        </article>
      </section>
    </div>
  )
}
