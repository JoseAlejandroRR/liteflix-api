import { Context, Next } from 'hono'
import { jwt } from 'hono/jwt'
import { AuthSession } from '@/domain/security'
import { match } from 'path-to-regexp'

const { JWT_SECRET_KEY } =  process.env

export const WHITELIST_AUTH_NON_REQUIRE: string[] = [
  '/api/auth/login'
]

const isWhitelisted = (url: string): boolean => {
  return WHITELIST_AUTH_NON_REQUIRE.some((pattern) => {

    const checker = match(pattern)
    const checked = checker(url)

    return checked
  })
}

export const authMiddleware = async (c: Context, next: Next) => {
  const requestUrl = c.req.path

  const session: AuthSession = {
    isAnonymous: false
  }

  c.set('auth', session)

  if (isWhitelisted(requestUrl)) {
    session.isAnonymous = true
    c.set('auth', session)
    return await next()
  }

  return jwt({
    secret: String(JWT_SECRET_KEY),
  })(c, next)
}
