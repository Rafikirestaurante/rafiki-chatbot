import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const required = [
  'package.json',
  'vite.config.js',
  'vercel.json',
  'firebase.json',
  'firestore.rules',
  'firestore.indexes.json',
  '.env.example',
  'src/main.jsx',
  'src/App.jsx',
  'src/lib/firebase.js',
  'functions/package.json',
  'functions/src/index.js',
  'README.md',
  'docs/ARQUITECTURA.md',
  'docs/CRONOGRAMA.md',
]

const missing = required.filter((file) => !existsSync(resolve(file)))
if (missing.length) {
  console.error('Faltan archivos requeridos:')
  missing.forEach((file) => console.error(`- ${file}`))
  process.exit(1)
}

for (const jsonFile of ['package.json', 'vercel.json', 'firebase.json', 'firestore.indexes.json', 'functions/package.json']) {
  JSON.parse(readFileSync(resolve(jsonFile), 'utf8'))
}

const pkg = JSON.parse(readFileSync(resolve('package.json'), 'utf8'))
if (pkg.version !== '0.1.0') throw new Error('La versión esperada es 0.1.0')
if (!readFileSync(resolve('firestore.rules'), 'utf8').includes("match /clientes/{clienteId}")) {
  throw new Error('Las reglas no contienen la colección clientes')
}

console.log('✓ Estructura Rafiki Chatbot Fase 1A válida')
console.log('✓ JSON válidos')
console.log('✓ Versión 0.1.0')
console.log('✓ Reglas Firestore presentes')
