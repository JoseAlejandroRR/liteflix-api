import ViewModel from '../ViewModel'
import { AuthenticationResult } from '@/domain/security'
import UserViewModel from './UserViewModel'

class LoginSuccessViewModel extends ViewModel<AuthenticationResult> {

  constructor(data: AuthenticationResult) {
    const { token, user } = data
    const view: Record<string, any> = {
      token,
      user: ViewModel.createOne(UserViewModel, user!)
    }

    super(view)
  }
}

export default LoginSuccessViewModel
