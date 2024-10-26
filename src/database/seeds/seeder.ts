import 'dotenv/config'
import { DataSource, DataSourceOptions } from 'typeorm'
import { runSeeders, SeederOptions } from 'typeorm-extension'
import { UserFactory } from './factories/UserFactory'

const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_DATABASE } = process.env

;(async () => {
  console.log('::START MIGRATION::')

  const options: DataSourceOptions & SeederOptions = {
    type: 'mysql',
    host: DB_HOST,
    port: Number(DB_PORT),
    username: DB_USER,
    password: DB_PASSWORD,
    database: DB_DATABASE,
    synchronize: false,
    logging: 'all',
    entities: ['src/domain/models/*.ts'],
    seeds: ['src/database/seeds/*.ts'],
    factories: [
      UserFactory,
    ]
  }

  const dataSource = new DataSource(options)

  await dataSource.initialize()

  await runSeeders(dataSource);
  console.log('::END MIGRATION::')
  process.exit()
})()
