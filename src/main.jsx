import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles.css'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  render() {
    if (this.state.error) {
      return (
        <main className="fatal-screen">
          <div className="fatal-card">
            <div className="brand-mark">RC</div>
            <h1>Rafiki Chatbot</h1>
            <p>La aplicación encontró un error inesperado.</p>
            <pre>{this.state.error.message}</pre>
            <button onClick={() => window.location.reload()}>Recargar aplicación</button>
          </div>
        </main>
      )
    }
    return this.props.children
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
)
