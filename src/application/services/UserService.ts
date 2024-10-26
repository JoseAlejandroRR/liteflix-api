import EntityNotFoundException from '@/domain/exceptions/EntityNotFoundException'
import { User } from '@/domain/models/User'
import { IUserRepository } from '@/domain/repositories/IUserRepository'
import { ServiceProviderIds } from '@/domain/ServiceProvideIds'
import { inject, injectable } from 'tsyringe'
@injectable()
class UserService {

  constructor(
    @inject(ServiceProviderIds.UserRepository) protected userRepository: IUserRepository
  ) { }

  async getUserByEmail(email: string): Promise<User> {
    const user = await this.userRepository.getUserByEmail(email)

    if (!user) {
      throw new EntityNotFoundException(User, email)
    }

    return user
  }
}

export default UserService
