export function normalizeWhatsAppNumber(value = '') {
  return value.replace(/\D/g, '')
}

export function displayPhone(value = '') {
  const digits = normalizeWhatsAppNumber(value)
  if (digits.startsWith('57') && digits.length === 12) {
    return `+57 ${digits.slice(2, 5)} ${digits.slice(5, 8)} ${digits.slice(8)}`
  }
  return digits ? `+${digits}` : '—'
}

export function formatDate(value) {
  if (!value) return '—'
  const date = value?.toDate ? value.toDate() : new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return new Intl.DateTimeFormat('es-CO', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}
