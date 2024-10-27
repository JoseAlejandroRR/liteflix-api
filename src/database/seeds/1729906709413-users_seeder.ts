import { DataSource } from 'typeorm'
import UserRole from './../../domain/enums/UserRole'
import { User } from './../../domain/models/User'
import { Seeder, SeederFactoryManager } from 'typeorm-extension'

export class UsersSeeder1729906709413 implements Seeder {
  track = false

  public async run(
      dataSource: DataSource,
      factoryManager: SeederFactoryManager
  ): Promise<any> {
    const repository =  dataSource.getRepository(User);
    const hasRecords = await repository.find()

    if (hasRecords.length > 0) return        

    const manager = User.create({
        firstname: 'Jose',
        lastname: 'Realza',
        role: UserRole.ADMIN,
        email: 'josealejandror28@gmail.com',
        password: '123123',
    })
    await repository.save(manager)

    const userDemo = User.create({
        firstname: 'User',
        lastname: 'Demo',
        role: UserRole.CUSTOMER,
        email: 'demo@demo.com',
        password: '123123',
    })
    
    await repository.save(userDemo)

    const userFactory = factoryManager.get(User)

    await userFactory.saveMany(5)
    console.log('✅ User Seeder Finished')
  }
}
