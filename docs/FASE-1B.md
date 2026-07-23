# Rafiki Chatbot — Fase 1B

## Objetivo

Desplegar y estabilizar la base Firebase creada en Fase 1A y comprobar el flujo administrativo real antes de conectar servicios externos.

## Cambios implementados

- Versión actualizada a `0.2.0`.
- Proyecto Firebase oficial: `rafiki-chatbot-dbd75`.
- Validación posterior al login: una cuenta solo entra al panel si existe `administradores/{uid}`, está activa y tiene rol `superadmin` o `admin`.
- Creación manual de clientes usando el número normalizado como ID del documento Firestore.
- Creación manual de recordatorios vinculados a un cliente existente.
- Fecha/hora de recordatorios interpretada inicialmente en `America/Bogota`.
- Diagnóstico con lectura real de administrador, conteo de clientes y conteo de recordatorios.
- Dashboard actualizado para reflejar las pruebas de Fase 1B.
- `.firebaserc` agregado con el Project ID oficial.
- `health` actualizado a versión 0.2.0 / Fase 1B, sin necesidad de desplegarlo todavía.

## Prueba funcional esperada

1. Crear el usuario administrador en Firebase Authentication.
2. Crear `administradores/{UID}` con `email`, `rol: superadmin` y `activo: true`.
3. Iniciar sesión en el panel.
4. Crear un cliente de prueba desde Clientes.
5. Crear un recordatorio de prueba asociado a ese cliente.
6. Confirmar que ambos aparecen en las tablas y en los contadores de Inicio.
7. Abrir Diagnóstico y ejecutar `Probar Firestore`.
8. Confirmar lectura autorizada y conteos correctos.

## Fuera de alcance

- Recepción o envío de WhatsApp.
- Gemini.
- Ejecución automática de recordatorios.
- Cloud Scheduler.
- Recurrencias avanzadas.
- Cobros y planes comerciales reales.

Estos elementos permanecen reservados para las fases posteriores del cronograma oficial.
