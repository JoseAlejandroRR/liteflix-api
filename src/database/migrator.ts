import 'dotenv/config'
import 'reflect-metadata'
import 'tsconfig-paths/register'
import { MysqlConfig } from '../infra/database/MysqlConfig'

export const runMigrations = async () => {
  try {
    console.log('Running migrations...')
    await MysqlConfig.runMigrations()
    console.log('Migrations completed successfully.')
  } catch (error) {
    MysqlConfig.undoLastMigration()
    console.error('Error running migrations:', error)
    throw error
  }
}
