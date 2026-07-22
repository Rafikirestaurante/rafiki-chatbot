# Rafiki Chatbot

Chatbot multiusuario de recordatorios por WhatsApp.

**Fase:** 1A — Base multiusuario  
**Versión:** 0.1.0  
**Fecha:** 22 de julio de 2026

## Regla principal

> Un número de WhatsApp = un cliente.

Los clientes no necesitan usuario, contraseña, empresa ni organización para el flujo inicial. El panel administrativo sí utiliza Firebase Authentication.

## Stack

- React 18 + Vite 8.
- Firebase Web SDK.
- Cloud Firestore.
- Firebase Authentication.
- Cloud Functions 2nd gen / Node 22.
- Vercel.
- GitHub.
- Próximamente: WhatsApp Cloud API + Gemini.

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

## Validar estructura

```bash
npm run check
```

## Compilar

```bash
npm run build
```

## Desplegar en Vercel

1. Subir el proyecto a GitHub.
2. Importar el repositorio en Vercel.
3. Framework: Vite.
4. Build command: `npm run build`.
5. Output directory: `dist`.
6. Agregar en Vercel las variables `VITE_FIREBASE_*`.

## Firebase Functions

```bash
cd functions
npm install
cd ..
firebase deploy --only functions:health
```

## Documentación

- `docs/FASE-1A.md`
- `docs/ARQUITECTURA.md`
- `docs/CRONOGRAMA.md`
- `docs/CONFIGURACION-FIREBASE.md`

## Seguridad

No subir `.env`, claves privadas, tokens de WhatsApp ni claves de Gemini a GitHub. Las credenciales de servicios externos se almacenarán como secretos del backend cuando se habiliten esas fases.
