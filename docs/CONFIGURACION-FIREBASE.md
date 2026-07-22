# Configuración Firebase — Fase 1A

1. Crear un proyecto Firebase independiente, recomendado: `rafiki-chatbot`.
2. Vincular facturación Blaze cuando se vayan a desplegar Cloud Functions.
3. Crear Cloud Firestore en modo producción.
4. Activar Authentication → Email/Password.
5. Registrar una aplicación Web.
6. Copiar `.env.example` como `.env` y llenar las variables `VITE_FIREBASE_*`.
7. Instalar Firebase CLI: `npm install -g firebase-tools`.
8. Ejecutar `firebase login`.
9. Ejecutar `firebase use --add` y elegir el proyecto.
10. Desplegar reglas e índices: `firebase deploy --only firestore:rules,firestore:indexes`.

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

## Functions

Para probar la función de diagnóstico:

```bash
cd functions
npm install
cd ..
firebase deploy --only functions:health
```

La Fase 1A no exporta todavía webhooks, Gemini ni el programador de recordatorios.
