import { useEffect, useMemo, useState } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { collection, doc, getCountFromServer, getDoc, query, where } from 'firebase/firestore'
import Sidebar from './components/Sidebar.jsx'
import Topbar from './components/Topbar.jsx'
import LoginPage from './pages/LoginPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import ClientesPage from './pages/ClientesPage.jsx'
import RecordatoriosPage from './pages/RecordatoriosPage.jsx'
import ConfiguracionPage from './pages/ConfiguracionPage.jsx'
import DiagnosticoPage from './pages/DiagnosticoPage.jsx'
import { auth, db, firebaseConfigured } from './lib/firebase.js'

const pageMeta = {
  inicio: ['Inicio', 'Resumen general del servicio'],
  clientes: ['Clientes', 'Números de WhatsApp registrados'],
  recordatorios: ['Recordatorios', 'Programación y estado de avisos'],
  configuracion: ['Configuración', 'Conexiones y parámetros del sistema'],
  diagnostico: ['Diagnóstico', 'Estado técnico y pruebas de Firebase'],
}

export default function App() {
  const [user, setUser] = useState(null)
  const [adminProfile, setAdminProfile] = useState(null)
  const [authReady, setAuthReady] = useState(!firebaseConfigured)
  const [loginError, setLoginError] = useState('')
  const [installationMode, setInstallationMode] = useState(false)
  const [page, setPage] = useState('inicio')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [refreshVersion, setRefreshVersion] = useState(0)
  const [stats, setStats] = useState({ clientes: 0, activos: 0, recordatorios: 0, pendientes: 0 })

  useEffect(() => {
    if (!auth || !db) return undefined

    return onAuthStateChanged(auth, async (nextUser) => {
      if (!nextUser) {
        setUser(null)
        setAdminProfile(null)
        setAuthReady(true)
        return
      }

      setAuthReady(false)
      try {
        const snapshot = await getDoc(doc(db, 'administradores', nextUser.uid))
        const profile = snapshot.exists() ? snapshot.data() : null
        const authorized = profile?.activo === true && ['superadmin', 'admin'].includes(profile?.rol)

        if (!authorized) {
          setLoginError('La cuenta existe en Firebase Authentication, pero no está autorizada como administrador activo en Firestore.')
          await signOut(auth)
          return
        }

        setLoginError('')
        setUser(nextUser)
        setAdminProfile(profile)
        setInstallationMode(false)
        setAuthReady(true)
      } catch (error) {
        console.error('No fue posible validar el administrador:', error)
        setLoginError('No fue posible validar el perfil administrador. Revisa Firestore y sus reglas de seguridad.')
        await signOut(auth)
      }
    })
  }, [])

  useEffect(() => {
    if (!db || installationMode || !user) return

    async function loadStats() {
      try {
        const [clientes, activos, recordatorios, pendientes] = await Promise.all([
          getCountFromServer(collection(db, 'clientes')),
          getCountFromServer(query(collection(db, 'clientes'), where('estado', '==', 'activo'))),
          getCountFromServer(collection(db, 'recordatorios')),
          getCountFromServer(query(collection(db, 'recordatorios'), where('estado', 'in', ['pendiente', 'programado']))),
        ])
        setStats({
          clientes: clientes.data().count,
          activos: activos.data().count,
          recordatorios: recordatorios.data().count,
          pendientes: pendientes.data().count,
        })
      } catch (error) {
        console.error('No fue posible cargar estadísticas:', error)
      }
    }

    loadStats()
  }, [user, installationMode, refreshVersion])

  const content = useMemo(() => {
    const onDataChanged = () => setRefreshVersion((value) => value + 1)
    if (page === 'clientes') return <ClientesPage installationMode={installationMode} onDataChanged={onDataChanged} />
    if (page === 'recordatorios') return <RecordatoriosPage installationMode={installationMode} onDataChanged={onDataChanged} />
    if (page === 'configuracion') return <ConfiguracionPage installationMode={installationMode} adminProfile={adminProfile} />
    if (page === 'diagnostico') return <DiagnosticoPage installationMode={installationMode} user={user} adminProfile={adminProfile} />
    return <DashboardPage stats={stats} installationMode={installationMode} />
  }, [page, stats, installationMode, adminProfile, user])

  if (!authReady) {
    return <main className="loading-screen"><div className="brand-mark">RC</div><span>Validando acceso administrativo…</span></main>
  }

  if (!user && !installationMode) {
    return <LoginPage externalError={loginError} onInstallationMode={() => setInstallationMode(true)} />
  }

  if (!user && firebaseConfigured && installationMode) {
    return <LoginPage externalError={loginError} onInstallationMode={() => setInstallationMode(true)} />
  }

  if (!user && !firebaseConfigured && !installationMode) {
    return <LoginPage externalError={loginError} onInstallationMode={() => setInstallationMode(true)} />
  }

  const [title, subtitle] = pageMeta[page]

  return (
    <div className="app-shell">
      <Sidebar active={page} onSelect={setPage} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      {sidebarOpen && <button className="sidebar-backdrop" onClick={() => setSidebarOpen(false)} aria-label="Cerrar menú" />}
      <main className="main-area">
        <Topbar
          title={title}
          subtitle={subtitle}
          onMenu={() => setSidebarOpen(true)}
          user={user}
          adminProfile={adminProfile}
          installationMode={installationMode}
          onLogout={async () => {
            await signOut(auth)
            setInstallationMode(false)
          }}
        />
        <div className="content-area">{content}</div>
      </main>
    </div>
  )
}
