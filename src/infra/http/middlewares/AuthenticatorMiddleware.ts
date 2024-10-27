import { Context, Next } from 'hono'
import { ServiceProviderIds } from '@/domain/ServiceProvideIds'
import { container } from 'tsyringe'
import { AuthSession } from '@/domain/security'
import { IUserRepository } from '@/domain/repositories/IUserRepository'


const AuthenticatorMiddleware = async (ctx: Context, next: Next) => {
  const userRepository: IUserRepository = container.resolve(
    ServiceProviderIds.UserRepository
  )

  let payload
  let user

  const auth: AuthSession = ctx.get('auth')

  try {
    payload = ctx.get('jwtPayload')

    if (payload) {
      user = await userRepository.findByKey(payload.id)
    }

  } catch (err) {
    console.log('[AuthenticatorMiddleware]: Error: ', err)
  }

  if (auth.isAnonymous === false && !user) {
    return ctx.json({ error: 'USER_NOT_FOUND' }, 401)
  }
  
  auth.user = user!

  ctx.set('auth', auth)

  return next()
}

export default AuthenticatorMiddleware
