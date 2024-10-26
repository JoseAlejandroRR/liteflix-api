import UnauthorizedUserException from '@/domain/exceptions/UnauthorizedUserException'
import { AuthSession } from '@/domain/security'
import { Context } from 'hono'

export abstract class BaseController {

  protected getAuthSession(ctx: Context): AuthSession {
    const auth = ctx.get('auth') as AuthSession;
    if (!auth || !auth.user) {
      throw new UnauthorizedUserException;
    }
    return auth
  }

}