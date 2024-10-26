import { Context } from 'hono'
import { BaseController } from './BaseController'
import { AuthenticationResult, UserCredentials } from '@/domain/security'
import { inject, injectable } from 'tsyringe'
import UserManager from '@/application/managers/UserManager'
import { MysqlConfig } from '@/infra/database/MysqlConfig'
import { User } from '@/domain/models/User'
import ViewModel from '@/domain/views/ViewModel'
import LoginSuccessViewModel from '@/domain/views/auth/LoginSuccessViewModel'

@injectable()
class AuthController extends BaseController {

  constructor(
    @inject(UserManager) private userManager: UserManager
  ) {
    super()
  }

  public async authenticate(ctx: Context) {
    const { email, password } = await ctx.req.json()
    const credentials: UserCredentials = {
      email,
      password
    }

    try {
      const repository = MysqlConfig.getRepository(User)
      const user = await repository.findOneBy({ email })

      const authentication: AuthenticationResult = await this.userManager.getAuthCredentials(
        credentials
      )

      if (authentication.token) {
        return ctx.json(ViewModel.createOne(LoginSuccessViewModel, authentication))
      } else {
        return ctx.json({ error : 'INVALID_CREDENTIALS'}, 401)
      }

    } catch (err) {
      let messageError = 'INVALID_CREDENTIALS'
      console.log('[authenticate] Error: ', err)
      return ctx.json({ error:  messageError }, 400)
    }
  }
}

export default AuthController
