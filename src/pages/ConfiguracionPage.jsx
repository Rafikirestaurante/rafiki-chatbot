import { firebaseConfigured, firebaseProjectId } from '../lib/firebase.js'
import StatusBadge from '../components/StatusBadge.jsx'

const integrations = [
  ['Firebase', 'Base de datos y autenticación', true],
  ['WhatsApp Cloud API', 'Canal principal de clientes', false],
  ['Gemini', 'Motor de interpretación de lenguaje', false],
  ['Cloud Scheduler', 'Ejecución automática de recordatorios', false],
]

export default function ConfiguracionPage({ installationMode, adminProfile }) {
  return (
    <div className="page-stack">
      <section className="panel-card">
        <div className="section-heading">
          <span className="eyebrow">Configuración</span>
          <h3>Integraciones del proyecto</h3>
          <p>Las claves privadas nunca deben guardarse en el frontend ni subirse a GitHub.</p>
        </div>
        <div className="integration-list">
          {integrations.map(([name, description, phaseReady]) => {
            const connected = name === 'Firebase' ? firebaseConfigured && !installationMode : false
            return (
              <div className="integration-row" key={name}>
                <div><strong>{name}</strong><span>{description}</span></div>
                <StatusBadge tone={connected ? 'success' : phaseReady ? 'warning' : 'neutral'}>
                  {connected ? 'Conectado' : phaseReady ? 'Pendiente de credenciales' : 'Próxima fase'}
                </StatusBadge>
              </div>
            )
          })}
        </div>
      </section>

      <section className="panel-card">
        <div className="section-heading">
          <span className="eyebrow">Firebase</span>
          <h3>Proyecto actual</h3>
        </div>
        <div className="config-grid">
          <div><span>Project ID</span><strong>{firebaseProjectId}</strong></div>
          <div><span>Rol actual</span><strong>{adminProfile?.rol || 'Sin sesión'}</strong></div>
          <div><span>Plan durante 1B</span><strong>Spark hasta necesitar Functions</strong></div>
          <div><span>Zona horaria base</span><strong>America/Bogota</strong></div>
          <div><span>Identidad del cliente</span><strong>Número de WhatsApp</strong></div>
          <div><span>Versión</span><strong>0.2.0 · Fase 1B</strong></div>
        </div>
      </section>
    </div>
  )
}
