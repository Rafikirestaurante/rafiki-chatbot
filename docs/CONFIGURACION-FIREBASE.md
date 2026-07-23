# Configuración Firebase — Fase 1B

Proyecto oficial: **`rafiki-chatbot-dbd75`**.

## Frontend

1. En Firebase Console, confirmar que Cloud Firestore está creado en modo producción.
2. Confirmar Authentication → Email/Password.
3. Copiar `.env.example` como `.env`.
4. Completar las variables `VITE_FIREBASE_*` con la aplicación Web registrada.
5. Nunca subir `.env` a GitHub.

## Primer administrador

1. Crear el usuario en Firebase Authentication con email/contraseña.
2. Copiar su UID.
3. En Firestore crear manualmente `administradores/{UID}` con:

```json
{
  "email": "tu-correo@ejemplo.com",
  "rol": "superadmin",
  "activo": true
}
```

4. Iniciar sesión desde el panel.
5. La aplicación comprobará que el documento existe, está activo y tiene rol permitido antes de abrir el panel.

## Firebase CLI

```bash
npm install -g firebase-tools
firebase login
firebase use rafiki-chatbot-dbd75
firebase deploy --only firestore:rules,firestore:indexes
```

El archivo `.firebaserc` ya contiene el Project ID oficial.

## Vercel

Configurar estas variables en el proyecto Vercel para Production, Preview y Development según corresponda:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

Después del despliegue:

1. Iniciar sesión.
2. Crear un cliente de prueba.
3. Crear un recordatorio de prueba.
4. Abrir Diagnóstico.
5. Ejecutar `Probar Firestore`.

## Blaze y Functions

La Fase 1B **no necesita activar Blaze** si solo se despliega el frontend, reglas e índices. La función `health` permanece preparada para cuando sea necesario desplegar Cloud Functions.
