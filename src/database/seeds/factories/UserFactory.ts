import { User } from './../../../domain/models/User'
import { setSeederFactory } from 'typeorm-extension'

export const UserFactory = setSeederFactory(User, (faker) => {
  const user = new User()
  user.firstname = faker.person.firstName();
  user.lastname = faker.person.lastName();
  user.email = faker.internet.email();
  user.password = faker.internet.password();

  return user
})
