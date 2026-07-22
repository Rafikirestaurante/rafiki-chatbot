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
          <span className="eyebrow">Rafiki Chatbot</span>
          <h2>Recordatorios por WhatsApp, simples y automáticos.</h2>
          <p>El número de WhatsApp será el identificador único de cada cliente.</p>
        </div>
        <StatusBadge tone={installationMode ? 'warning' : 'success'}>
          {installationMode ? 'Configuración pendiente' : 'Sistema conectado'}
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
              <span className="eyebrow">Flujo principal</span>
              <h3>Cómo funcionará el servicio</h3>
            </div>
          </div>
          <div className="flow-list">
            {[
              ['1', 'WhatsApp', 'El cliente escribe desde su número.'],
              ['2', 'Gemini', 'Interpreta la intención y la fecha.'],
              ['3', 'Firebase', 'Guarda y controla el recordatorio.'],
              ['4', 'WhatsApp', 'Envía el aviso cuando corresponde.'],
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
              <span className="eyebrow">Fase actual</span>
              <h3>Base técnica</h3>
            </div>
          </div>
          <div className="check-list">
            <div><span>✓</span> React + Vite</div>
            <div><span>✓</span> Firebase Web modular</div>
            <div><span>✓</span> Firestore + reglas RLS equivalentes</div>
            <div><span>✓</span> Firebase Authentication</div>
            <div><span>✓</span> Cloud Functions preparadas</div>
            <div><span>✓</span> Vercel + GitHub preparados</div>
          </div>
        </article>
      </section>
    </div>
  )
}
