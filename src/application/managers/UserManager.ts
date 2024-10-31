import { inject, injectable } from 'tsyringe'
import UserService from '../services/UserService'
import { AuthenticationResult, UserCredentials } from '@/domain/security'
import BaseManager from './BaseManager'
import { sign } from 'jsonwebtoken'
import ViewModel from '@/infra/views/ViewModel'
import UserViewModel from '@/infra/views/auth/UserViewModel'

const { JWT_SECRET_KEY, JWT_TOKEN_TIMEOUT } = process.env

@injectable()
class UserManager extends BaseManager {

  constructor(
    @inject(UserService) protected userService: UserService
  ) { 
    super()
  }

  async getAuthCredentials(credentials: UserCredentials): Promise<AuthenticationResult> {
    const user = await this.userService.getUserByEmail(credentials.email)

    const isPasswordEqual = await user.checkPassword(credentials.password)
    if (!isPasswordEqual) return { user: null, token: null }

    const userView = ViewModel.createOne(UserViewModel, user)
    const token =  sign({
        ...userView.toJSON(),
        exp: Math.floor(Date.now() / 1000) + 60 * (!this.isDevelopment ? 60 * 48 : Number(JWT_TOKEN_TIMEOUT) )
      },
      String(JWT_SECRET_KEY)
    )

    return {
      user,
      token
    }
  }
}

export default UserManager
