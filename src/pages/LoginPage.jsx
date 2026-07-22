import { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth, firebaseConfigured } from '../lib/firebase.js'

export default function LoginPage({ onInstallationMode }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(event) {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password)
    } catch (err) {
      setError('No fue posible iniciar sesión. Revisa el correo, la contraseña y la configuración de Firebase.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="login-screen">
      <section className="login-card">
        <div className="login-brand-row">
          <div className="brand-mark large">RC</div>
          <div>
            <h1>Rafiki Chatbot</h1>
            <p>Recordatorios inteligentes por WhatsApp</p>
          </div>
        </div>

        <div className="phase-label">Fase 1A · Base multiusuario</div>

        {firebaseConfigured ? (
          <form onSubmit={submit} className="login-form">
            <label>
              Correo del administrador
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@ejemplo.com" />
            </label>
            <label>
              Contraseña
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
            </label>
            {error && <div className="inline-error">{error}</div>}
            <button className="primary-button" disabled={loading}>{loading ? 'Ingresando…' : 'Ingresar'}</button>
          </form>
        ) : (
          <div className="setup-box">
            <h2>Proyecto listo para configurar</h2>
            <p>Agrega las variables de Firebase en <code>.env</code> para activar el inicio de sesión y la base de datos.</p>
            <button className="primary-button" onClick={onInstallationMode}>Ver panel en modo instalación</button>
          </div>
        )}

        <footer>Firebase · Gemini · WhatsApp Cloud API</footer>
      </section>
    </main>
  )
}
