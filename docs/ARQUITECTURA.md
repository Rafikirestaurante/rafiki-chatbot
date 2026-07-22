# Arquitectura — Rafiki Chatbot

## Regla central

**Un número de WhatsApp = un cliente.**

El teléfono normalizado en formato E.164 sin símbolos se usará como identificador lógico del cliente. No se requiere empresa, organización ni cuenta del cliente en el panel para el flujo inicial.

## Componentes

- **Frontend:** React + Vite.
- **Panel:** Vercel.
- **Repositorio:** GitHub.
- **Backend:** Firebase Cloud Functions 2nd gen.
- **Base:** Cloud Firestore.
- **Administradores:** Firebase Authentication con email/contraseña.
- **IA futura:** Gemini Flash-Lite mediante backend.
- **Canal futuro:** WhatsApp Cloud API.
- **Programador futuro:** Cloud Scheduler + Functions.

## Flujo futuro

WhatsApp → Cloud Function → Gemini → Firestore → Scheduler → Cloud Function → WhatsApp.

## Colecciones previstas

### `administradores`
Documento por UID de Firebase Auth.

Campos base: `email`, `rol`, `activo`, `creadoEn`.

### `clientes`
ID recomendado: teléfono normalizado, por ejemplo `573001234567`.

Campos base: `telefono`, `nombre`, `estado`, `plan`, `zonaHoraria`, `creadoEn`, `ultimaActividad`.

### `recordatorios`
Campos base: `clienteId`, `telefono`, `titulo`, `programadoPara`, `zonaHoraria`, `estado`, `recurrencia`, `intentos`, `creadoEn`, `actualizadoEn`, `enviadoEn`.

### Futuras
`conversaciones`, `mensajes`, `consumoIA`, `envios`, `errores`, `configuracion`.

## Seguridad

El navegador solo accede a datos cuando el usuario está autenticado y tiene documento activo en `administradores/{uid}`. Las integraciones WhatsApp/Gemini se ejecutarán únicamente desde Cloud Functions usando secretos del servidor.
