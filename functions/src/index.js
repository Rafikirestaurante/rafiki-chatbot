import { onRequest } from 'firebase-functions/v2/https'
import { initializeApp } from 'firebase-admin/app'

initializeApp()

export const health = onRequest(
  {
    region: 'us-central1',
    cors: true,
    invoker: 'public',
  },
  (request, response) => {
    response.status(200).json({
      ok: true,
      service: 'rafiki-chatbot-functions',
      version: '0.2.0',
      phase: '1B',
      timestamp: new Date().toISOString(),
    })
  },
)
