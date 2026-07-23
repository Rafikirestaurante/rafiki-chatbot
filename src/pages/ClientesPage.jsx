import { useEffect, useState } from 'react'
import { doc, getDoc, limit, onSnapshot, orderBy, query, collection, serverTimestamp, setDoc } from 'firebase/firestore'
import { db } from '../lib/firebase.js'
import { displayPhone, formatDate, normalizeWhatsAppNumber } from '../lib/format.js'
import StatusBadge from '../components/StatusBadge.jsx'

const initialForm = { telefono: '', nombre: '' }

export default function ClientesPage({ installationMode, onDataChanged }) {
  const [rows, setRows] = useState([])
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState(initialForm)

  useEffect(() => {
    if (installationMode || !db) return undefined
    const q = query(collection(db, 'clientes'), orderBy('creadoEn', 'desc'), limit(100))
    return onSnapshot(q, (snapshot) => {
      setRows(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })))
      setError('')
    }, (snapshotError) => {
      console.error('Error cargando clientes:', snapshotError)
      setError('No fue posible cargar los clientes. Revisa permisos e índices de Firestore.')
    })
  }, [installationMode])

  async function createClient(event) {
    event.preventDefault()
    setError('')
    setNotice('')

    const phone = normalizeWhatsAppNumber(form.telefono)
    if (phone.length < 8 || phone.length > 15) {
      setError('Escribe el número completo con código de país. Ejemplo Colombia: 573001234567.')
      return
    }

    setSaving(true)
    try {
      const ref = doc(db, 'clientes', phone)
      const existing = await getDoc(ref)
      if (existing.exists()) {
        setError('Ese número de WhatsApp ya está registrado como cliente.')
        return
      }
      await setDoc(ref, {
        telefono: phone,
        nombre: form.nombre.trim(),
        plan: 'Inicial',
        estado: 'activo',
        zonaHoraria: 'America/Bogota',
        creadoEn: serverTimestamp(),
        ultimaActividad: serverTimestamp(),
        origen: 'panel_admin',
      }, { merge: false })
      setForm(initialForm)
      setShowForm(false)
      setNotice(`Cliente ${displayPhone(phone)} creado correctamente.`)
      onDataChanged?.()
    } catch (createError) {
      console.error('Error creando cliente:', createError)
      setError('No fue posible crear el cliente. Revisa la conexión y las reglas de Firestore.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="page-stack">
      <section className="panel-card table-card">
        <div className="section-heading split">
          <div>
            <span className="eyebrow">Clientes</span>
            <h3>Un número de WhatsApp = un cliente</h3>
            <p>En Fase 1B puedes crear clientes manualmente para validar Firestore antes de conectar WhatsApp.</p>
          </div>
          <button className="secondary-button" disabled={installationMode} onClick={() => setShowForm((value) => !value)}>
            {showForm ? 'Cerrar' : 'Nuevo cliente'}
          </button>
        </div>

        {showForm && (
          <form className="inline-form" onSubmit={createClient}>
            <label>
              WhatsApp con código de país
              <input
                value={form.telefono}
                onChange={(event) => setForm({ ...form, telefono: event.target.value })}
                placeholder="573001234567"
                inputMode="tel"
                required
              />
            </label>
            <label>
              Nombre
              <input value={form.nombre} onChange={(event) => setForm({ ...form, nombre: event.target.value })} placeholder="Opcional" />
            </label>
            <button className="primary-button" disabled={saving}>{saving ? 'Guardando…' : 'Guardar cliente'}</button>
          </form>
        )}

        {error && <div className="inline-error">{error}</div>}
        {notice && <div className="inline-success">{notice}</div>}

        <div className="table-wrap">
          <table>
            <thead><tr><th>WhatsApp</th><th>Nombre</th><th>Plan</th><th>Estado</th><th>Última actividad</th></tr></thead>
            <tbody>
              {rows.length === 0 ? (
                <tr><td colSpan="5"><div className="empty-state"><strong>Aún no hay clientes</strong><span>Crea uno manualmente para comprobar la base de la Fase 1B.</span></div></td></tr>
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
    </div>
  )
}
