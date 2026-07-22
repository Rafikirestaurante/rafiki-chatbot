# Fase 1A — Resumen de entrega

Rafiki Chatbot inicia como proyecto independiente orientado a recordatorios gestionados mediante WhatsApp. Se adopta una regla de producto central: cada cliente se identifica técnicamente por su número de WhatsApp en formato E.164. No se requiere empresa, organización ni cuenta del cliente para el flujo base.

La Fase 1A implementa el panel administrativo en React + Vite, preparado para GitHub y Vercel. Incluye navegación de Inicio, Clientes, Recordatorios, Conversaciones, Consumo IA, Configuración y Errores. El Dashboard muestra clientes registrados y estado de recordatorios. Clientes permite registrar manualmente números de WhatsApp y Recordatorios permite crear programaciones internas asociadas a cada número.

Supabase se utiliza como backend central. La migración incluida crea perfiles administrativos, clientes de WhatsApp, recordatorios, mensajes, consumo de IA, errores y auditoría. Se habilita Row Level Security y se restringe el acceso del panel a usuarios autenticados registrados como administradores. El frontend solo utiliza URL y anon key; futuras claves privadas de WhatsApp y OpenAI quedan expresamente reservadas para Edge Functions.

La aplicación incluye modo demostración cuando aún no existen variables de Supabase, facilitando revisar la interfaz antes del despliegue. No se implementan todavía llamadas reales a WhatsApp ni OpenAI, para mantener separada la base de datos y validar primero el núcleo operativo.

Próximas fases: 1B para edición, cancelación, reprogramación, recurrencias y cola de recordatorios; 2A para WhatsApp Cloud API; 2B para interpretación con OpenAI; 2C para envíos automáticos mediante Supabase Cron y Edge Functions; y Fase 3 para planes comerciales, límites, métricas y cobros.
