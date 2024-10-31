import { Context, MiddlewareHandler, Next } from 'hono'

export const CacheControl = (maxAge: number = 300): MiddlewareHandler  => {
  return (c: Context, next: Next) => {
    c.header('Cache-Control', `public, max-age=${maxAge}`)
    return next()
  }
}