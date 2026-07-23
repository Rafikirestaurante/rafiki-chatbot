import { useState } from 'react'
import { collection, doc, getCountFromServer, getDoc } from 'firebase/firestore'
import { db, firebaseConfigured, firebaseProjectId } from '../lib/firebase.js'
import StatusBadge from '../components/StatusBadge.jsx'

export default function DiagnosticoPage({ installationMode, user, adminProfile }) {
  const [testing, setTesting] = useState(false)
  const [result, setResult] = useState(null)

  const checks = [
    ['Frontend React', true, 'Aplicación cargada correctamente'],
    ['Variables Firebase', firebaseConfigured, firebaseConfigured ? 'Variables presentes' : 'Faltan variables VITE_FIREBASE_*'],
    ['Proyecto Firebase', firebaseConfigured, firebaseProjectId],
    ['Autenticación', Boolean(user), user?.email || (installationMode ? 'Modo instalación activo' : 'Sin sesión')],
    ['Administrador Firestore', Boolean(adminProfile?.activo), adminProfile ? `${adminProfile.rol} · activo` : 'Sin perfil validado'],
    ['WhatsApp', false, 'Se conectará en Fase 2'],
    ['Gemini', false, 'Se conectará en Fase 3'],
  ]

  async function runFirestoreTest() {
    if (!db || !user) return
    setTesting(true)
    setResult(null)
    try {
      const [adminSnapshot, clientsCount, remindersCount] = await Promise.all([
        getDoc(doc(db, 'administradores', user.uid)),
        getCountFromServer(collection(db, 'clientes')),
        getCountFromServer(collection(db, 'recordatorios')),
      ])
      setResult({
        ok: adminSnapshot.exists(),
        detail: `Lectura autorizada · ${clientsCount.data().count} clientes · ${remindersCount.data().count} recordatorios`,
      })
    } catch (error) {
      console.error('Diagnóstico Firestore:', error)
      setResult({ ok: false, detail: `${error.code || 'error'} · ${error.message || 'No fue posible leer Firestore'}` })
    } finally {
      setTesting(false)
    }
  }

  return (
    <div className="page-stack">
      <section className="panel-card">
        <div className="section-heading split">
          <div>
            <span className="eyebrow">Diagnóstico</span>
            <h3>Estado técnico</h3>
            <p>La información técnica queda concentrada aquí para mantener limpio el resto de la interfaz.</p>
          </div>
          <button className="secondary-button" disabled={!user || testing} onClick={runFirestoreTest}>
            {testing ? 'Probando…' : 'Probar Firestore'}
          </button>
        </div>
        <div className="diagnostic-list">
          {checks.map(([name, ok, detail]) => (
            <div className="diagnostic-row" key={name}>
              <div><strong>{name}</strong><span>{detail}</span></div>
              <StatusBadge tone={ok ? 'success' : 'warning'}>{ok ? 'Correcto' : 'Pendiente'}</StatusBadge>
            </div>
          ))}
          {result && (
            <div className="diagnostic-row">
              <div><strong>Prueba real de Firestore</strong><span>{result.detail}</span></div>
              <StatusBadge tone={result.ok ? 'success' : 'danger'}>{result.ok ? 'Correcto' : 'Error'}</StatusBadge>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
