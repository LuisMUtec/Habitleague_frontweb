// src/config/api.ts

export const API_CONFIG = {
  // URL directa del backend
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',

  ENDPOINTS: {
    // Auth
    LOGIN:    '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT:   '/auth/logout',

    // Perfil de usuario
    GET_PROFILE:    '/user/profile',   // GET /api/user/profile
    UPDATE_PROFILE: '/user/profile',   // PATCH /api/user/profile
    UPLOAD_PHOTO:   '/user/upload-photo',

    // Retos
    GET_CHALLENGES:   '/challenges',               // GET /api/challenges
    CREATE_CHALLENGE: '/challenges',               // POST /api/challenges
    MY_CHALLENGES:    '/challenges/my-challenges', // GET /api/challenges/my-challenges
    JOIN_CHALLENGE:   '/challenges/:id/join',
    LEAVE_CHALLENGE:  '/challenges/:id/leave',

    // Tareas (ejemplo)
    GET_TASKS:    '/tasks',
    CREATE_TASK:  '/tasks',
    UPDATE_TASK:  '/tasks/:id',
    DELETE_TASK:  '/tasks/:id',

    // Pagos
    PROCESS_PAYMENT:      '/payments/process',
    MY_PAYMENTS:          '/payments/my-payments',
    PAYMENT_STATUS:       '/payments/challenge/:challengeId/status',
    PAYMENT_BY_STRIPE_ID: '/payments/stripe/:stripePaymentId',

    // Logros
    MY_ACHIEVEMENTS:      '/achievements/my-achievements',
    
    // Evidencias
    SUBMIT_EVIDENCE:      '/evidences',
    MY_EVIDENCES:         '/evidences/my-evidences',
    EVIDENCE_BY_ID:       '/evidences/:evidenceId',
    EVIDENCES_BY_CHALLENGE: '/evidences/challenge/:challengeId',
    DAILY_STATUS:         '/evidences/challenge/:challengeId/daily-status',
    EVIDENCE_STATS:       '/evidences/my-stats',
    EVIDENCE_HEALTH:      '/evidences/health',
  },

  // Timeout y reintentos
  TIMEOUT: 10000,
  RETRY: {
    MAX_RETRIES: 3,
    RETRY_DELAY: 1000,
  },
}

/** Construye URL completa, p.ej. '/user/profile' → '/api/user/profile' */
export const buildApiUrl = (endpoint: string): string =>
  `${API_CONFIG.BASE_URL}${endpoint}`

/** Reemplaza parámetros nombrados, p.ej. '/tasks/:id' → '/tasks/123' */
export const replaceUrlParams = (
  url: string,
  params: Record<string, string>
): string => {
  let result = url
  Object.entries(params).forEach(([key, value]) => {
    result = result.replace(`:${key}`, value)
  })
  return result
}
