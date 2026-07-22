import { useEffect, useState } from 'react'
import { collection, limit, onSnapshot, orderBy, query } from 'firebase/firestore'
import { db } from '../lib/firebase.js'
import { displayPhone, formatDate } from '../lib/format.js'
import StatusBadge from '../components/StatusBadge.jsx'

const toneByStatus = {
  pendiente: 'warning',
  programado: 'info',
  enviado: 'success',
  completado: 'success',
  cancelado: 'neutral',
  fallido: 'danger',
}

export default function RecordatoriosPage({ installationMode }) {
  const [rows, setRows] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    if (installationMode || !db) return undefined
    const q = query(collection(db, 'recordatorios'), orderBy('creadoEn', 'desc'), limit(100))
    return onSnapshot(q, (snapshot) => {
      setRows(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })))
    }, () => setError('No fue posible cargar los recordatorios.'))
  }, [installationMode])

  return (
    <section className="panel-card table-card">
      <div className="section-heading split">
        <div>
          <span className="eyebrow">Recordatorios</span>
          <h3>Control central de recordatorios</h3>
          <p>En Fase 1C agregaremos creación manual y edición desde este panel.</p>
        </div>
        <button className="primary-button compact" disabled>Crear recordatorio</button>
      </div>
      {error && <div className="inline-error">{error}</div>}
      <div className="table-wrap">
        <table>
          <thead><tr><th>Recordatorio</th><th>WhatsApp</th><th>Programado</th><th>Estado</th></tr></thead>
          <tbody>
            {rows.length === 0 ? (
              <tr><td colSpan="4"><div className="empty-state"><strong>No hay recordatorios todavía</strong><span>La colección ya está contemplada en la arquitectura.</span></div></td></tr>
            ) : rows.map((row) => (
              <tr key={row.id}>
                <td><strong>{row.titulo || 'Sin título'}</strong></td>
                <td>{displayPhone(row.telefono || row.clienteId)}</td>
                <td>{formatDate(row.programadoPara)}</td>
                <td><StatusBadge tone={toneByStatus[row.estado] || 'neutral'}>{row.estado || 'pendiente'}</StatusBadge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
