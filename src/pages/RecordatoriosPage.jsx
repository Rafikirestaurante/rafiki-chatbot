import { useEffect, useMemo, useState } from 'react'
import { addDoc, collection, limit, onSnapshot, orderBy, query, serverTimestamp, Timestamp } from 'firebase/firestore'
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

const initialForm = { clienteId: '', titulo: '', programadoPara: '' }

export default function RecordatoriosPage({ installationMode, onDataChanged }) {
  const [rows, setRows] = useState([])
  const [clients, setClients] = useState([])
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState(initialForm)

  useEffect(() => {
    if (installationMode || !db) return undefined
    const remindersQuery = query(collection(db, 'recordatorios'), orderBy('creadoEn', 'desc'), limit(100))
    return onSnapshot(remindersQuery, (snapshot) => {
      setRows(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })))
      setError('')
    }, (snapshotError) => {
      console.error('Error cargando recordatorios:', snapshotError)
      setError('No fue posible cargar los recordatorios.')
    })
  }, [installationMode])

  useEffect(() => {
    if (installationMode || !db) return undefined
    const clientsQuery = query(collection(db, 'clientes'), orderBy('creadoEn', 'desc'), limit(200))
    return onSnapshot(clientsQuery, (snapshot) => {
      setClients(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })))
    })
  }, [installationMode])

  const selectedClient = useMemo(
    () => clients.find((client) => client.id === form.clienteId),
    [clients, form.clienteId],
  )

  async function createReminder(event) {
    event.preventDefault()
    setError('')
    setNotice('')

    const date = new Date(`${form.programadoPara}:00-05:00`)
    if (!selectedClient) {
      setError('Selecciona un cliente válido.')
      return
    }
    if (Number.isNaN(date.getTime())) {
      setError('Selecciona una fecha y hora válidas.')
      return
    }

    setSaving(true)
    try {
      await addDoc(collection(db, 'recordatorios'), {
        clienteId: selectedClient.id,
        telefono: selectedClient.telefono || selectedClient.id,
        titulo: form.titulo.trim(),
        programadoPara: Timestamp.fromDate(date),
        zonaHoraria: selectedClient.zonaHoraria || 'America/Bogota',
        estado: 'pendiente',
        recurrencia: 'ninguna',
        intentos: 0,
        creadoEn: serverTimestamp(),
        actualizadoEn: serverTimestamp(),
        origen: 'panel_admin',
      })
      setForm(initialForm)
      setShowForm(false)
      setNotice('Recordatorio creado correctamente en Firestore.')
      onDataChanged?.()
    } catch (createError) {
      console.error('Error creando recordatorio:', createError)
      setError('No fue posible crear el recordatorio. Revisa la conexión y las reglas de Firestore.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="page-stack">
      <section className="panel-card table-card">
        <div className="section-heading split">
          <div>
            <span className="eyebrow">Recordatorios</span>
            <h3>Control central de recordatorios</h3>
            <p>La creación manual permite validar el modelo antes de integrar WhatsApp, Gemini y Scheduler.</p>
          </div>
          <button className="primary-button compact" disabled={installationMode || clients.length === 0} onClick={() => setShowForm((value) => !value)}>
            {showForm ? 'Cerrar' : 'Crear recordatorio'}
          </button>
        </div>

        {showForm && (
          <form className="inline-form reminder-form" onSubmit={createReminder}>
            <label>
              Cliente
              <select required value={form.clienteId} onChange={(event) => setForm({ ...form, clienteId: event.target.value })}>
                <option value="">Seleccionar…</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>{client.nombre || 'Sin nombre'} · {displayPhone(client.telefono || client.id)}</option>
                ))}
              </select>
            </label>
            <label>
              Recordatorio
              <input required maxLength="160" value={form.titulo} onChange={(event) => setForm({ ...form, titulo: event.target.value })} placeholder="Ej. Llamar al proveedor" />
            </label>
            <label>
              Fecha y hora
              <input required type="datetime-local" value={form.programadoPara} onChange={(event) => setForm({ ...form, programadoPara: event.target.value })} />
            </label>
            <button className="primary-button" disabled={saving}>{saving ? 'Guardando…' : 'Guardar recordatorio'}</button>
          </form>
        )}

        {clients.length === 0 && !installationMode && <div className="inline-info">Primero crea al menos un cliente desde la pestaña Clientes.</div>}
        {error && <div className="inline-error">{error}</div>}
        {notice && <div className="inline-success">{notice}</div>}

        <div className="table-wrap">
          <table>
            <thead><tr><th>Recordatorio</th><th>WhatsApp</th><th>Programado</th><th>Estado</th></tr></thead>
            <tbody>
              {rows.length === 0 ? (
                <tr><td colSpan="4"><div className="empty-state"><strong>No hay recordatorios todavía</strong><span>Crea uno manualmente para validar la Fase 1B.</span></div></td></tr>
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
    </div>
  )
}
