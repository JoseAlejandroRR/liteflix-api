import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { authMiddleware } from './middlewares/AuthMiddleware'
import AuthenticatorMiddleware from './middlewares/AuthenticatorMiddleware'

const { SERVER_ORIGINS, SERVER_CORS_ORIGIN_ACTIVE } = process.env

const serverAddress = SERVER_ORIGINS ? String(SERVER_ORIGINS).split(',') : ['*']

const httpServer = new Hono()

if (Boolean(SERVER_CORS_ORIGIN_ACTIVE) === true) {
  // Middleware for CORS
  httpServer.use('*', cors({
    origin: serverAddress,
  }))
}

httpServer.use(logger())

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   security:
 *     - bearerAuth: []
 *
 */

// Auth Middleware
httpServer.use('/api/*', authMiddleware);
httpServer.use('/api/*', AuthenticatorMiddleware);

// Healtcheck
httpServer.get('/health', (c) => {
  return c.json({ currentTime: new Date() })
});

httpServer.get('/', (c) => {
    return c.text('LiteFlix its Here!')
});

export default httpServer
