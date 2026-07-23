# Checklist de despliegue — Fase 1B

## 1. GitHub

- Crear repositorio independiente para Rafiki Chatbot.
- Subir el contenido de esta versión.
- Confirmar que `.env`, `node_modules` y `dist` no estén versionados.
- Confirmar que `.firebaserc` apunte a `rafiki-chatbot-dbd75`.

## 2. Firebase

- Authentication → Email/Password activo.
- Usuario administrador creado.
- Documento `administradores/{UID}` creado con `rol: superadmin` y `activo: true`.
- Desplegar `firestore.rules` e `firestore.indexes.json`.

## 3. Vercel

- Importar repositorio GitHub.
- Framework: Vite.
- Build command: `npm run build`.
- Output: `dist`.
- Agregar todas las variables `VITE_FIREBASE_*`.
- Publicar.

## 4. Prueba funcional

- Iniciar sesión con administrador autorizado.
- Confirmar que una cuenta de Authentication sin administrador activo no accede al panel.
- Crear cliente manual con número completo y código de país.
- Confirmar que el documento usa el teléfono normalizado como ID.
- Crear recordatorio manual vinculado al cliente.
- Confirmar contadores del Inicio.
- Ejecutar `Probar Firestore` en Diagnóstico.
- Revisar versión `0.2.0 · Fase 1B`.

## 5. Criterio de cierre

Fase 1B queda cerrada cuando el despliegue de producción cumpla todo el checklist anterior. WhatsApp, Gemini, Scheduler y Functions no son requisito para cerrar esta fase.
