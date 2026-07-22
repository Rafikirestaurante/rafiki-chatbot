# Rafiki Chatbot · Roadmap inicial

## Fase 1A — Base administrativa (esta entrega)
- React + Vite.
- Panel administrativo responsive.
- Supabase Auth.
- Cliente = número de WhatsApp.
- CRUD inicial de clientes.
- Creación manual de recordatorios.
- Tablas para conversaciones, consumo IA, errores y auditoría.
- RLS para acceso administrativo.
- Modo demo sin Supabase.

## Fase 1B — Operación de recordatorios
- Editar, cancelar, completar y reprogramar recordatorios.
- Reglas de recurrencia más completas.
- Filtros, búsqueda y métricas del Dashboard.
- Preparar cola segura de envíos.

## Fase 2A — WhatsApp Cloud API
- Webhook de verificación y recepción.
- Identificación/alta automática por teléfono.
- Guardado de mensajes y estados.
- Respuestas básicas sin IA.

## Fase 2B — Motor IA
- OpenAI API.
- Interpretación estructurada de intención, fecha, hora y recurrencia.
- Crear/consultar/modificar/cancelar recordatorios.
- Control de consumo por número.

## Fase 2C — Envío automático
- Supabase Cron + Edge Function.
- Plantillas aprobadas de WhatsApp.
- Reintentos, idempotencia y registro de entregas.

## Fase 3 — Producto comercial
- Planes y límites.
- Activación/suspensión de números.
- Métricas de uso y costo.
- Políticas de privacidad y retención.
- Cobros y administración comercial.
