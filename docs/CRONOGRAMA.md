# Cronograma general — Rafiki Chatbot

## Fase 1A — Base Firebase · CERRADA

Arquitectura React + Vite + Firebase, Authentication administrativo, Firestore, reglas, índices, panel responsive, modo instalación, Error Boundary, función `health` y documentación base.

## Fase 1B — Despliegue y estabilización · ACTUAL

Publicar el proyecto en GitHub y Vercel, configurar las variables Firebase, validar login administrativo, Firestore, reglas, panel y diagnóstico. Crear clientes y recordatorios manualmente desde el administrador para comprobar completamente la base antes de integrar servicios externos.

## Fase 2A — WhatsApp Cloud API

Crear y configurar Meta Developer/WhatsApp Business, número del chatbot, token, webhook y verificación. Firebase recibirá mensajes, identificará automáticamente el número y creará al cliente cuando escriba por primera vez.

## Fase 2B — Comunicación WhatsApp

Implementar envío de respuestas, registro de mensajes, estados de entrega, errores y reintentos. Validar completamente WhatsApp sin inteligencia artificial.

## Fase 3A — Gemini

Integrar Gemini Flash-Lite desde Cloud Functions. Interpretar lenguaje natural y convertirlo en acciones estructuradas: crear, consultar, editar, cancelar, completar y aplazar recordatorios.

## Fase 3B — Conversación inteligente

Agregar contexto conversacional, confirmaciones de fechas ambiguas, interpretación de expresiones como mañana, próximo viernes, en dos horas y similares.

## Fase 4 — Motor automático

Activar Firebase Blaze, Cloud Functions y Cloud Scheduler. Ejecutar periódicamente los recordatorios pendientes y enviarlos mediante WhatsApp evitando duplicados.

## Fase 5 — Recordatorios avanzados

Agregar recurrencias diarias, semanales, mensuales y personalizadas; aplazamientos; confirmación de completado y seguimiento.

## Fase 6 — Panel administrativo

Dashboard completo de clientes, recordatorios, conversaciones, mensajes, errores, actividad, consumo Gemini y consumo WhatsApp.

## Fase 7 — Seguridad y costos

Rate limiting, límites por cliente, auditoría, protección de secretos, alertas Blaze, métricas, control de abuso y respaldos.

## Fase 8 — Comercialización

Crear planes Personal, Plus y Premium, límites mensuales, dominio propio, onboarding, términos, privacidad y posteriormente sistema de pagos.

## Primera gran meta funcional

**WhatsApp → Gemini → Firebase → Recordatorio → WhatsApp.**
