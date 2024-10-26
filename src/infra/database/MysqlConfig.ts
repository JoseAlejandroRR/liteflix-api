import { DataSource } from 'typeorm'

const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_DATABASE, NODE_ENV, DB_LOG } = process.env

const isDevelopment = NODE_ENV === 'development' 

export const MysqlConfig = new DataSource({
  type: 'mysql',
  host: DB_HOST,
  port: Number(DB_PORT),
  username: DB_USER,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  synchronize: false,
  logging: DB_LOG === 'true' ? 'all' : false,
  entities: isDevelopment ? ['src/domain/models/*.ts'] : ['dist/domain/models/*.js'],
  migrations: isDevelopment ? ['src/database/migrations/*.ts'] :['dist/database/migrations/*.js'],
})
