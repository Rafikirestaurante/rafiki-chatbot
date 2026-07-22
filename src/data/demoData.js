export const demoUsers = [
  {
    id: 'demo-user-1',
    phone_e164: '+573001234567',
    display_name: 'Cliente demo',
    status: 'active',
    plan: 'free',
    timezone: 'America/Bogota',
    created_at: new Date().toISOString(),
    last_interaction_at: new Date().toISOString(),
  },
]

export const demoReminders = [
  {
    id: 'demo-reminder-1',
    whatsapp_user_id: 'demo-user-1',
    title: 'Pagar servicio de internet',
    scheduled_at: new Date(Date.now() + 86400000).toISOString(),
    recurrence: 'none',
    status: 'pending',
    source: 'manual',
    created_at: new Date().toISOString(),
    whatsapp_users: { display_name: 'Cliente demo', phone_e164: '+573001234567' },
  },
]
