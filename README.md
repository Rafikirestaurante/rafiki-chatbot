# Rafiki Chatbot

**Versión:** 0.1.0  
**Fase:** 1A — Base administrativa multiusuario  
**Fecha:** 22 de julio de 2026

Rafiki Chatbot es un proyecto independiente de recordatorios por WhatsApp. La identidad principal del cliente es **su número de WhatsApp**. No depende de Google Calendar.

## Arquitectura prevista

- React 18 + Vite para el panel.
- Vercel para publicar el frontend.
- GitHub para control de versiones.
- Supabase Auth + PostgreSQL + RLS.
- WhatsApp Cloud API (Fase 2A).
- OpenAI API (Fase 2B).
- Supabase Cron / Edge Functions para envíos programados (Fase 2C).

## Qué funciona en Fase 1A

- Panel responsive.
- Login administrativo con Supabase Auth.
- Dashboard.
- Alta manual de clientes por número de WhatsApp.
- Alta manual de recordatorios.
- Vistas preparadas para conversaciones, consumo IA, configuración y errores.
- Base SQL con RLS.
- Modo demostración si todavía no configuras Supabase.

## 1. Instalar localmente

Requiere Node.js 22.12 o superior dentro de la rama 22.

```bash
npm install --package-lock=false
npm run dev
```

Para validar producción:

```bash
npm run build
```

## 2. Crear Supabase

1. Crea un proyecto nuevo en Supabase.
2. Abre **SQL Editor**.
3. Ejecuta completo:

```text
supabase/migrations/20260722_fase1a_base.sql
```

4. En Authentication crea manualmente el usuario administrador con correo y contraseña.
5. Mantén deshabilitado el registro público en esta etapa. El panel solo incluye inicio de sesión.

La migración activa RLS en todas las tablas expuestas y permite acceso a administradores autenticados.

## 3. Variables de entorno

Copia `.env.example` a `.env.local` y completa:

```text
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

No agregues tokens privados de WhatsApp u OpenAI al frontend.

## 4. Subir a GitHub

Crea un repositorio llamado, por ejemplo:

```text
rafiki-chatbot
```

Luego:

```bash
git init
git add .
git commit -m "Fase 1A - Base administrativa Rafiki Chatbot"
git branch -M main
git remote add origin URL_DE_TU_REPOSITORIO
git push -u origin main
```

## 5. Publicar en Vercel

Importa el repositorio de GitHub y agrega las dos variables públicas de Supabase en Vercel:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Build command: `npm run build`  
Output directory: `dist`

`vercel.json` ya incluye el rewrite para que la SPA cargue correctamente al refrescar.

## Seguridad

- La `anon key` puede usarse en el navegador porque la protección de datos depende de RLS.
- La `service_role` **nunca** debe ponerse en Vercel como variable `VITE_*` ni incluirse en el frontend.
- Las claves de WhatsApp y OpenAI se guardarán como secretos de Supabase Edge Functions en las fases correspondientes.
- En Fase 1A el acceso administrativo se crea únicamente desde Supabase Auth; no existe registro público desde la aplicación.

## Próximo paso recomendado

Continuar con **Fase 1B — Operación de recordatorios**, antes de conectar WhatsApp. Esa fase cerrará edición, cancelación, reprogramación y recurrencias para que el núcleo del producto esté estable.
