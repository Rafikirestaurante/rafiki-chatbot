# Rafiki Chatbot

Chatbot independiente de recordatorios inteligentes por WhatsApp.

**Fase:** 1B — Despliegue y estabilización  
**Versión:** 0.2.0  
**Fecha:** 22 de julio de 2026  
**Firebase:** `rafiki-chatbot-dbd75`

## Regla principal

> Un número de WhatsApp = un cliente.

Los clientes no necesitan usuario, contraseña, empresa ni organización para el flujo inicial. El panel administrativo utiliza Firebase Authentication y además exige un documento activo en `administradores/{uid}`.

## Alcance de la Fase 1B

- Preparación para GitHub y Vercel.
- Validación real de administrador contra Firestore.
- Lectura protegida por reglas de seguridad.
- Creación manual de clientes desde el panel.
- Creación manual de recordatorios desde el panel.
- Diagnóstico con prueba real de lectura de Firestore.
- Proyecto Firebase oficial preconfigurado en `.firebaserc`.
- WhatsApp, Gemini y Cloud Scheduler todavía permanecen desactivados.

## Stack

- React 18 + Vite 8.
- Firebase Web SDK.
- Cloud Firestore.
- Firebase Authentication.
- Cloud Functions 2nd gen / Node 22 preparadas para fases posteriores.
- Vercel.
- GitHub.

## Ejecutar localmente

```bash
npm install
npm run dev
```

La aplicación puede abrirse sin credenciales en **modo instalación**.

## Configurar Firebase

```bash
cp .env.example .env
```

Completa las variables entregadas por Firebase al registrar la app Web. Después revisa `docs/CONFIGURACION-FIREBASE.md`.

## Validar y compilar

```bash
npm run check
npm run build
```

## Desplegar en Vercel

1. Subir el proyecto a GitHub.
2. Importar el repositorio en Vercel.
3. Framework: Vite.
4. Build command: `npm run build`.
5. Output directory: `dist`.
6. Agregar las variables `VITE_FIREBASE_*` en Vercel.
7. Publicar y validar login, Clientes, Recordatorios y Diagnóstico.

## Firebase

Para la Fase 1B es suficiente desplegar reglas e índices:

```bash
firebase deploy --only firestore:rules,firestore:indexes
```

La función `health` queda preparada, pero no es necesario activar Blaze ni desplegar Functions hasta que una fase posterior lo requiera.

## Documentación

- `docs/FASE-1A.md`
- `docs/FASE-1B.md`
- `docs/ARQUITECTURA.md`
- `docs/CRONOGRAMA.md`
- `docs/CONFIGURACION-FIREBASE.md`
- `docs/DESPLIEGUE-FASE-1B.md`
- `docs/VALIDACION-FASE-1B.md`

## Seguridad

No subir `.env`, claves privadas, tokens de WhatsApp ni claves de Gemini a GitHub. Las credenciales de servicios externos se almacenarán como secretos del backend cuando se habiliten esas fases.
