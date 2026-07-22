import { useEffect, useMemo, useState } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { collection, getCountFromServer, query, where } from 'firebase/firestore'
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
  diagnostico: ['Diagnóstico', 'Estado técnico y preparación de integraciones'],
}

export default function App() {
  const [user, setUser] = useState(null)
  const [authReady, setAuthReady] = useState(!firebaseConfigured)
  const [installationMode, setInstallationMode] = useState(false)
  const [page, setPage] = useState('inicio')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [stats, setStats] = useState({ clientes: 0, activos: 0, recordatorios: 0, pendientes: 0 })

  useEffect(() => {
    if (!auth) return undefined
    return onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser)
      setAuthReady(true)
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
      } catch {
        // El diagnóstico mostrará problemas de configuración; el dashboard permanece limpio.
      }
    }
    loadStats()
  }, [user, installationMode])

  const content = useMemo(() => {
    if (page === 'clientes') return <ClientesPage installationMode={installationMode} />
    if (page === 'recordatorios') return <RecordatoriosPage installationMode={installationMode} />
    if (page === 'configuracion') return <ConfiguracionPage installationMode={installationMode} />
    if (page === 'diagnostico') return <DiagnosticoPage installationMode={installationMode} />
    return <DashboardPage stats={stats} installationMode={installationMode} />
  }, [page, stats, installationMode])

  if (!authReady) {
    return <main className="loading-screen"><div className="brand-mark">RC</div><span>Cargando Rafiki Chatbot…</span></main>
  }

  if (!user && !installationMode) {
    return <LoginPage onInstallationMode={() => setInstallationMode(true)} />
  }

  if (!user && firebaseConfigured && installationMode) {
    return <LoginPage onInstallationMode={() => setInstallationMode(true)} />
  }

  if (!user && !firebaseConfigured && !installationMode) {
    return <LoginPage onInstallationMode={() => setInstallationMode(true)} />
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
