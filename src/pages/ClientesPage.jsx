import { useEffect, useState } from 'react'
import { collection, limit, onSnapshot, orderBy, query } from 'firebase/firestore'
import { db } from '../lib/firebase.js'
import { displayPhone, formatDate } from '../lib/format.js'
import StatusBadge from '../components/StatusBadge.jsx'

export default function ClientesPage({ installationMode }) {
  const [rows, setRows] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    if (installationMode || !db) return undefined
    const q = query(collection(db, 'clientes'), orderBy('creadoEn', 'desc'), limit(100))
    return onSnapshot(q, (snapshot) => {
      setRows(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })))
    }, () => setError('No fue posible cargar los clientes. Revisa permisos e índices de Firestore.'))
  }, [installationMode])

  return (
    <section className="panel-card table-card">
      <div className="section-heading split">
        <div>
          <span className="eyebrow">Clientes</span>
          <h3>Un número de WhatsApp = un cliente</h3>
          <p>Los clientes se crearán automáticamente cuando escriban por primera vez.</p>
        </div>
        <button className="secondary-button" disabled>Nuevo cliente automático</button>
      </div>

      {error && <div className="inline-error">{error}</div>}

      <div className="table-wrap">
        <table>
          <thead><tr><th>WhatsApp</th><th>Nombre</th><th>Plan</th><th>Estado</th><th>Última actividad</th></tr></thead>
          <tbody>
            {rows.length === 0 ? (
              <tr><td colSpan="5"><div className="empty-state"><strong>Aún no hay clientes</strong><span>Los números aparecerán aquí al conectar WhatsApp Cloud API.</span></div></td></tr>
            ) : rows.map((row) => (
              <tr key={row.id}>
                <td><strong>{displayPhone(row.telefono || row.id)}</strong></td>
                <td>{row.nombre || 'Sin nombre'}</td>
                <td>{row.plan || 'Inicial'}</td>
                <td><StatusBadge tone={row.estado === 'activo' ? 'success' : 'neutral'}>{row.estado || 'activo'}</StatusBadge></td>
                <td>{formatDate(row.ultimaActividad)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
