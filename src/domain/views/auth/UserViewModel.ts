import { User } from '@/domain/models/User'
import ViewModel from '../ViewModel'

class UserViewModel extends ViewModel<User> {
  constructor(user: User) {
    const view: Record<string, any> = {
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      fullName: `${user.firstname} ${user.lastname}`,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }

    super(view)
  }
}

export default UserViewModel
