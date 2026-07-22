import { useEffect, useMemo, useState } from 'react'
import Icon from './components/Icon.jsx'
import { demoReminders, demoUsers } from './data/demoData.js'
import { isSupabaseConfigured, supabase } from './lib/supabase.js'

const navItems = [
  ['inicio', 'Inicio', 'home'],
  ['clientes', 'Clientes', 'users'],
  ['recordatorios', 'Recordatorios', 'bell'],
  ['conversaciones', 'Conversaciones', 'message'],
  ['consumo', 'Consumo IA', 'chart'],
  ['configuracion', 'Configuración', 'settings'],
  ['errores', 'Errores', 'alert'],
]

const formatDateTime = (value) => {
  if (!value) return '—'
  return new Intl.DateTimeFormat('es-CO', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'America/Bogota',
  }).format(new Date(value))
}

const normalizePhone = (value) => {
  const digits = value.replace(/\D/g, '')
  if (!digits) return ''
  if (digits.length === 10) return `+57${digits}`
  return `+${digits}`
}

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const login = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    const { error: loginError } = await supabase.auth.signInWithPassword({ email, password })
    if (loginError) setError(loginError.message)
    setLoading(false)
  }

  return (
    <div className="login-shell">
      <form className="login-card" onSubmit={login}>
        <div className="brand-mark">R</div>
        <p className="eyebrow">RAFIKI CHATBOT</p>
        <h1>Panel administrativo</h1>
        <p className="muted">Ingresa con el usuario administrador creado en Supabase.</p>
        <label>Correo</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <label>Contraseña</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        {error && <div className="error-box">{error}</div>}
        <button className="primary full" type="submit" disabled={loading}>{loading ? 'Ingresando…' : 'Ingresar'}</button>
      </form>
    </div>
  )
}

function App() {
  const [session, setSession] = useState(null)
  const [authChecked, setAuthChecked] = useState(!isSupabaseConfigured)
  const [page, setPage] = useState('inicio')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [users, setUsers] = useState(isSupabaseConfigured ? [] : demoUsers)
  const [reminders, setReminders] = useState(isSupabaseConfigured ? [] : demoReminders)
  const [messages, setMessages] = useState([])
  const [usage, setUsage] = useState([])
  const [errors, setErrors] = useState([])
  const [loading, setLoading] = useState(false)
  const [dataError, setDataError] = useState('')

  useEffect(() => {
    if (!supabase) return
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setAuthChecked(true)
    })
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, nextSession) => setSession(nextSession))
    return () => authListener.subscription.unsubscribe()
  }, [])

  const loadData = async () => {
    if (!supabase || !session) return
    setLoading(true)
    setDataError('')
    const [usersRes, remindersRes, messagesRes, usageRes, errorsRes] = await Promise.all([
      supabase.from('whatsapp_users').select('*').order('created_at', { ascending: false }),
      supabase.from('reminders').select('*, whatsapp_users(display_name, phone_e164)').order('scheduled_at', { ascending: true }),
      supabase.from('messages').select('*, whatsapp_users(display_name, phone_e164)').order('created_at', { ascending: false }).limit(50),
      supabase.from('ai_usage').select('*').order('created_at', { ascending: false }).limit(100),
      supabase.from('system_errors').select('*').order('created_at', { ascending: false }).limit(50),
    ])
    const firstError = [usersRes, remindersRes, messagesRes, usageRes, errorsRes].find((result) => result.error)?.error
    if (firstError) setDataError(firstError.message)
    setUsers(usersRes.data || [])
    setReminders(remindersRes.data || [])
    setMessages(messagesRes.data || [])
    setUsage(usageRes.data || [])
    setErrors(errorsRes.data || [])
    setLoading(false)
  }

  useEffect(() => { loadData() }, [session])

  const pendingCount = reminders.filter((r) => r.status === 'pending').length
  const sentCount = reminders.filter((r) => r.status === 'sent' || r.status === 'completed').length
  const failedCount = reminders.filter((r) => r.status === 'failed').length

  const stats = useMemo(() => ({
    clients: users.length,
    pending: pendingCount,
    sent: sentCount,
    failed: failedCount,
  }), [users, pendingCount, sentCount, failedCount])

  if (!authChecked) return <div className="center-screen">Cargando Rafiki Chatbot…</div>
  if (isSupabaseConfigured && !session) return <Login />

  const goTo = (id) => {
    setPage(id)
    setSidebarOpen(false)
  }

  return (
    <div className="app-shell">
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="brand">
          <div className="brand-mark small">R</div>
          <div><strong>Rafiki Chatbot</strong><span>Administrador</span></div>
          <button className="icon-only mobile-close" onClick={() => setSidebarOpen(false)}><Icon name="close" /></button>
        </div>
        <nav>
          {navItems.map(([id, label, icon]) => (
            <button key={id} className={page === id ? 'active' : ''} onClick={() => goTo(id)}>
              <Icon name={icon} size={19} /><span>{label}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <span className={`status-dot ${isSupabaseConfigured ? 'ok' : 'demo'}`}></span>
          <div><strong>{isSupabaseConfigured ? 'Supabase conectado' : 'Modo demostración'}</strong><small>Fase 1A · v0.1.0</small></div>
        </div>
      </aside>

      <main className="content">
        <header className="topbar">
          <button className="icon-only mobile-menu" onClick={() => setSidebarOpen(true)}><Icon name="menu" /></button>
          <div><p className="eyebrow">RAFIKI CHATBOT</p><h2>{navItems.find((item) => item[0] === page)?.[1]}</h2></div>
          <div className="top-actions">
            {loading && <span className="muted compact">Actualizando…</span>}
            {session && <button className="ghost" onClick={() => supabase.auth.signOut()}><Icon name="logout" size={17} /> Salir</button>}
          </div>
        </header>

        {!isSupabaseConfigured && (
          <div className="setup-banner">
            <strong>Vista de demostración.</strong> Configura <code>VITE_SUPABASE_URL</code> y <code>VITE_SUPABASE_ANON_KEY</code> para trabajar con datos reales.
          </div>
        )}
        {dataError && <div className="error-box">Supabase respondió: {dataError}. Verifica que ejecutaste la migración SQL de Fase 1A.</div>}

        {page === 'inicio' && <Dashboard stats={stats} reminders={reminders} users={users} />}
        {page === 'clientes' && <Clients users={users} onCreated={loadData} demo={!isSupabaseConfigured} />}
        {page === 'recordatorios' && <Reminders reminders={reminders} users={users} onCreated={loadData} demo={!isSupabaseConfigured} />}
        {page === 'conversaciones' && <Messages messages={messages} />}
        {page === 'consumo' && <Usage usage={usage} />}
        {page === 'configuracion' && <Settings />}
        {page === 'errores' && <Errors errors={errors} />}
      </main>
      {sidebarOpen && <button className="sidebar-backdrop" onClick={() => setSidebarOpen(false)} aria-label="Cerrar menú" />}
    </div>
  )
}

function Dashboard({ stats, reminders, users }) {
  const upcoming = reminders.filter((r) => r.status === 'pending').slice(0, 5)
  return (
    <div className="page-stack">
      <section className="hero-panel">
        <div><p className="eyebrow">CENTRO DE CONTROL</p><h1>Recordatorios por WhatsApp, en un solo lugar.</h1><p>El número de WhatsApp es la identidad principal de cada cliente.</p></div>
        <div className="hero-badge"><span>{users.length}</span><small>clientes registrados</small></div>
      </section>
      <section className="stats-grid">
        <StatCard label="Clientes" value={stats.clients} hint="Números de WhatsApp" />
        <StatCard label="Pendientes" value={stats.pending} hint="Por enviar" />
        <StatCard label="Procesados" value={stats.sent} hint="Enviados / completados" />
        <StatCard label="Fallidos" value={stats.failed} hint="Requieren revisión" danger={stats.failed > 0} />
      </section>
      <section className="panel">
        <div className="panel-heading"><div><p className="eyebrow">PRÓXIMOS</p><h3>Recordatorios pendientes</h3></div></div>
        <ReminderTable rows={upcoming} empty="Todavía no hay recordatorios pendientes." />
      </section>
    </div>
  )
}

function StatCard({ label, value, hint, danger }) {
  return <div className={`stat-card ${danger ? 'danger' : ''}`}><span>{label}</span><strong>{value}</strong><small>{hint}</small></div>
}

function Clients({ users, onCreated, demo }) {
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ phone: '', name: '', plan: 'free' })
  const [error, setError] = useState('')

  const create = async (e) => {
    e.preventDefault()
    if (demo) return setError('Conecta Supabase para crear clientes reales.')
    const phone = normalizePhone(form.phone)
    if (phone.length < 9) return setError('Ingresa un número de WhatsApp válido.')
    const { error: insertError } = await supabase.from('whatsapp_users').insert({
      phone_e164: phone,
      display_name: form.name.trim() || null,
      plan: form.plan,
    })
    if (insertError) return setError(insertError.message)
    setForm({ phone: '', name: '', plan: 'free' })
    setError('')
    setShowForm(false)
    onCreated()
  }

  return (
    <div className="page-stack">
      <div className="section-heading"><div><h1>Clientes</h1><p>Cada cliente se identifica por su número de WhatsApp.</p></div><button className="primary" onClick={() => setShowForm(!showForm)}><Icon name="plus" size={17} /> Nuevo cliente</button></div>
      {showForm && <form className="panel form-grid" onSubmit={create}>
        <div><label>WhatsApp</label><input placeholder="3001234567" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required /></div>
        <div><label>Nombre (opcional)</label><input placeholder="Cómo desea identificarlo" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
        <div><label>Plan</label><select value={form.plan} onChange={(e) => setForm({ ...form, plan: e.target.value })}><option value="free">Free</option><option value="personal">Personal</option><option value="plus">Plus</option></select></div>
        <div className="form-actions"><button className="primary" type="submit">Guardar cliente</button><button className="ghost" type="button" onClick={() => setShowForm(false)}>Cancelar</button></div>
        {error && <div className="error-box form-wide">{error}</div>}
      </form>}
      <section className="panel table-wrap">
        <table><thead><tr><th>WhatsApp</th><th>Nombre</th><th>Plan</th><th>Estado</th><th>Última interacción</th><th>Registro</th></tr></thead>
          <tbody>{users.length ? users.map((user) => <tr key={user.id}><td className="mono">{user.phone_e164}</td><td>{user.display_name || 'Sin nombre'}</td><td><span className="pill">{user.plan}</span></td><td><span className={`pill ${user.status === 'active' ? 'success' : ''}`}>{user.status === 'active' ? 'Activo' : user.status}</span></td><td>{formatDateTime(user.last_interaction_at)}</td><td>{formatDateTime(user.created_at)}</td></tr>) : <tr><td colSpan="6" className="empty">No hay clientes registrados.</td></tr>}</tbody>
        </table>
      </section>
    </div>
  )
}

function Reminders({ reminders, users, onCreated, demo }) {
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ userId: '', title: '', date: '', time: '', recurrence: 'none' })
  const [error, setError] = useState('')

  const create = async (e) => {
    e.preventDefault()
    if (demo) return setError('Conecta Supabase para crear recordatorios reales.')
    const localDate = new Date(`${form.date}T${form.time}:00-05:00`)
    if (Number.isNaN(localDate.getTime())) return setError('Fecha u hora inválida.')
    const { error: insertError } = await supabase.from('reminders').insert({
      whatsapp_user_id: form.userId,
      title: form.title.trim(),
      scheduled_at: localDate.toISOString(),
      recurrence: form.recurrence,
      source: 'manual',
    })
    if (insertError) return setError(insertError.message)
    setForm({ userId: '', title: '', date: '', time: '', recurrence: 'none' })
    setError('')
    setShowForm(false)
    onCreated()
  }

  return (
    <div className="page-stack">
      <div className="section-heading"><div><h1>Recordatorios</h1><p>Programación interna en Supabase; no depende de Google Calendar.</p></div><button className="primary" onClick={() => setShowForm(!showForm)}><Icon name="plus" size={17} /> Nuevo recordatorio</button></div>
      {showForm && <form className="panel form-grid" onSubmit={create}>
        <div><label>Cliente</label><select value={form.userId} onChange={(e) => setForm({ ...form, userId: e.target.value })} required><option value="">Seleccionar WhatsApp</option>{users.map((user) => <option value={user.id} key={user.id}>{user.display_name || user.phone_e164} · {user.phone_e164}</option>)}</select></div>
        <div><label>Recordatorio</label><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Ej. Pagar factura de energía" required /></div>
        <div><label>Fecha</label><input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required /></div>
        <div><label>Hora</label><input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} required /></div>
        <div><label>Repetición</label><select value={form.recurrence} onChange={(e) => setForm({ ...form, recurrence: e.target.value })}><option value="none">No repetir</option><option value="daily">Diario</option><option value="weekly">Semanal</option><option value="monthly">Mensual</option></select></div>
        <div className="form-actions"><button className="primary" type="submit">Guardar recordatorio</button><button className="ghost" type="button" onClick={() => setShowForm(false)}>Cancelar</button></div>
        {error && <div className="error-box form-wide">{error}</div>}
      </form>}
      <section className="panel"><ReminderTable rows={reminders} empty="No hay recordatorios registrados." /></section>
    </div>
  )
}

function ReminderTable({ rows, empty }) {
  return <div className="table-wrap"><table><thead><tr><th>Cliente</th><th>Recordatorio</th><th>Programado</th><th>Repetición</th><th>Estado</th><th>Origen</th></tr></thead><tbody>{rows.length ? rows.map((item) => <tr key={item.id}><td>{item.whatsapp_users?.display_name || item.whatsapp_users?.phone_e164 || '—'}<small className="subline">{item.whatsapp_users?.phone_e164}</small></td><td>{item.title}</td><td>{formatDateTime(item.scheduled_at)}</td><td>{item.recurrence === 'none' ? 'Una vez' : item.recurrence}</td><td><span className={`pill ${item.status === 'pending' ? 'warning' : item.status === 'failed' ? 'danger-pill' : 'success'}`}>{item.status}</span></td><td>{item.source}</td></tr>) : <tr><td colSpan="6" className="empty">{empty}</td></tr>}</tbody></table></div>
}

function Messages({ messages }) {
  return <div className="page-stack"><div className="section-heading"><div><h1>Conversaciones</h1><p>Quedará alimentado automáticamente por WhatsApp Cloud API en Fase 2A.</p></div></div><section className="panel table-wrap"><table><thead><tr><th>Fecha</th><th>Cliente</th><th>Dirección</th><th>Mensaje</th><th>Estado</th></tr></thead><tbody>{messages.length ? messages.map((m) => <tr key={m.id}><td>{formatDateTime(m.created_at)}</td><td>{m.whatsapp_users?.display_name || m.whatsapp_users?.phone_e164}</td><td>{m.direction}</td><td>{m.body}</td><td>{m.status}</td></tr>) : <tr><td colSpan="5" className="empty">Aún no hay conversaciones. Se habilitarán al conectar WhatsApp.</td></tr>}</tbody></table></section></div>
}

function Usage({ usage }) {
  const totals = usage.reduce((acc, row) => ({ input: acc.input + (row.input_tokens || 0), output: acc.output + (row.output_tokens || 0), cost: acc.cost + Number(row.estimated_cost_usd || 0) }), { input: 0, output: 0, cost: 0 })
  return <div className="page-stack"><div className="section-heading"><div><h1>Consumo IA</h1><p>Preparado para registrar uso por mensaje y por cliente.</p></div></div><section className="stats-grid three"><StatCard label="Tokens entrada" value={totals.input.toLocaleString('es-CO')} hint="Acumulado" /><StatCard label="Tokens salida" value={totals.output.toLocaleString('es-CO')} hint="Acumulado" /><StatCard label="Costo estimado" value={`US$ ${totals.cost.toFixed(4)}`} hint="Acumulado" /></section><section className="panel empty-panel">Los registros aparecerán cuando conectemos el motor de IA.</section></div>
}

function Settings() {
  const items = [
    ['Supabase', isSupabaseConfigured ? 'Configurado' : 'Pendiente', isSupabaseConfigured],
    ['WhatsApp Cloud API', 'Fase 2A', false],
    ['OpenAI API', 'Fase 2B', false],
    ['Motor automático de envíos', 'Fase 2C', false],
  ]
  return <div className="page-stack"><div className="section-heading"><div><h1>Configuración</h1><p>Estado de los componentes principales de Rafiki Chatbot.</p></div></div><section className="panel settings-list">{items.map(([name, status, ok]) => <div className="settings-row" key={name}><div><strong>{name}</strong><small>{name === 'Supabase' ? 'Base de datos y autenticación' : 'Integración pendiente de la siguiente fase'}</small></div><span className={`pill ${ok ? 'success' : ''}`}>{status}</span></div>)}</section><section className="panel note"><strong>Seguridad</strong><p>Las claves privadas de OpenAI y WhatsApp nunca deben usar el prefijo <code>VITE_</code>. En fases posteriores se almacenarán como secretos de Supabase Edge Functions.</p></section></div>
}

function Errors({ errors }) {
  return <div className="page-stack"><div className="section-heading"><div><h1>Errores</h1><p>Registro técnico centralizado sin llenar la interfaz principal de mensajes.</p></div></div><section className="panel table-wrap"><table><thead><tr><th>Fecha</th><th>Origen</th><th>Código</th><th>Detalle</th><th>Resuelto</th></tr></thead><tbody>{errors.length ? errors.map((e) => <tr key={e.id}><td>{formatDateTime(e.created_at)}</td><td>{e.source}</td><td className="mono">{e.error_code || '—'}</td><td>{e.message}</td><td>{e.resolved_at ? 'Sí' : 'No'}</td></tr>) : <tr><td colSpan="5" className="empty">No hay errores registrados.</td></tr>}</tbody></table></section></div>
}

export default App
