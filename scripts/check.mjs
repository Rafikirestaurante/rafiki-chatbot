import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const required = [
  'package.json',
  'vite.config.js',
  'vercel.json',
  'firebase.json',
  '.firebaserc',
  'firestore.rules',
  'firestore.indexes.json',
  '.env.example',
  'VERSION.json',
  'src/main.jsx',
  'src/App.jsx',
  'src/lib/firebase.js',
  'src/pages/ClientesPage.jsx',
  'src/pages/RecordatoriosPage.jsx',
  'src/pages/DiagnosticoPage.jsx',
  'functions/package.json',
  'functions/src/index.js',
  'README.md',
  'docs/ARQUITECTURA.md',
  'docs/CRONOGRAMA.md',
  'docs/CONFIGURACION-FIREBASE.md',
  'docs/FASE-1B.md',
  'docs/DESPLIEGUE-FASE-1B.md',
  'docs/VALIDACION-FASE-1B.md',
]

const missing = required.filter((file) => !existsSync(resolve(file)))
if (missing.length) {
  console.error('Faltan archivos requeridos:')
  missing.forEach((file) => console.error(`- ${file}`))
  process.exit(1)
}

for (const jsonFile of ['package.json', 'vercel.json', 'firebase.json', '.firebaserc', 'firestore.indexes.json', 'functions/package.json', 'VERSION.json']) {
  JSON.parse(readFileSync(resolve(jsonFile), 'utf8'))
}

const pkg = JSON.parse(readFileSync(resolve('package.json'), 'utf8'))
const version = JSON.parse(readFileSync(resolve('VERSION.json'), 'utf8'))
const firebaseRc = JSON.parse(readFileSync(resolve('.firebaserc'), 'utf8'))
const rules = readFileSync(resolve('firestore.rules'), 'utf8')
const app = readFileSync(resolve('src/App.jsx'), 'utf8')
const clients = readFileSync(resolve('src/pages/ClientesPage.jsx'), 'utf8')
const reminders = readFileSync(resolve('src/pages/RecordatoriosPage.jsx'), 'utf8')
const diagnostics = readFileSync(resolve('src/pages/DiagnosticoPage.jsx'), 'utf8')

if (pkg.version !== '0.2.0') throw new Error('La versión esperada es 0.2.0')
if (version.phase !== '1B') throw new Error('VERSION.json debe indicar Fase 1B')
if (firebaseRc.projects?.default !== 'rafiki-chatbot-dbd75') throw new Error('Project ID Firebase inesperado')
if (!rules.includes("match /clientes/{clienteId}")) throw new Error('Las reglas no contienen la colección clientes')
if (!rules.includes("match /recordatorios/{recordatorioId}")) throw new Error('Las reglas no contienen la colección recordatorios')
if (!app.includes("doc(db, 'administradores', nextUser.uid)")) throw new Error('Falta validar el perfil administrador')
if (!clients.includes("setDoc(ref")) throw new Error('Falta creación manual de clientes')
if (!reminders.includes("addDoc(collection(db, 'recordatorios')")) throw new Error('Falta creación manual de recordatorios')
if (!diagnostics.includes('Probar Firestore')) throw new Error('Falta diagnóstico real de Firestore')

console.log('✓ Estructura Rafiki Chatbot Fase 1B válida')
console.log('✓ JSON válidos')
console.log('✓ Versión 0.2.0')
console.log('✓ Firebase rafiki-chatbot-dbd75')
console.log('✓ Validación de administrador presente')
console.log('✓ Creación manual de clientes y recordatorios presente')
console.log('✓ Diagnóstico Firestore presente')
