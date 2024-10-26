import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { authMiddleware } from './middlewares/AuthMiddleware'

const { SERVER_ORIGINS } = process.env

const serverAddress = SERVER_ORIGINS ? String(SERVER_ORIGINS).split(',') : ['*']

const httpServer = new Hono()

// Middleware for CORS
httpServer.use('*', cors({ origin: '*' }))
httpServer.use('*', cors({
  origin: serverAddress,
}))

httpServer.use(logger())

// Auth Middleware
httpServer.use('/api/*', authMiddleware);

// Healtcheck
httpServer.get('/health', (c) => {
  return c.json({ currentTime: new Date() })
});

httpServer.get('/', (c) => {
    return c.text('LiteFlix its Here!')
});

export default httpServer
