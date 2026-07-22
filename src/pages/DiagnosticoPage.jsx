import { firebaseConfigured, firebaseProjectId } from '../lib/firebase.js'
import StatusBadge from '../components/StatusBadge.jsx'

export default function DiagnosticoPage({ installationMode }) {
  const checks = [
    ['Frontend React', true, 'Aplicación cargada correctamente'],
    ['Variables Firebase', firebaseConfigured, firebaseConfigured ? 'Variables presentes' : 'Falta copiar .env.example a .env'],
    ['Proyecto Firebase', firebaseConfigured, firebaseProjectId],
    ['Autenticación', !installationMode && firebaseConfigured, installationMode ? 'Modo instalación activo' : 'Disponible'],
    ['WhatsApp', false, 'Se conectará en Fase 2'],
    ['Gemini', false, 'Se conectará en Fase 3'],
  ]

  return (
    <section className="panel-card">
      <div className="section-heading">
        <span className="eyebrow">Diagnóstico</span>
        <h3>Estado técnico</h3>
        <p>La información técnica queda concentrada aquí para mantener limpio el resto de la interfaz.</p>
      </div>
      <div className="diagnostic-list">
        {checks.map(([name, ok, detail]) => (
          <div className="diagnostic-row" key={name}>
            <div><strong>{name}</strong><span>{detail}</span></div>
            <StatusBadge tone={ok ? 'success' : 'warning'}>{ok ? 'Correcto' : 'Pendiente'}</StatusBadge>
          </div>
        ))}
      </div>
    </section>
  )
}
