import IDatabase from '@/domain/database/IDatabase'
import { MysqlConfig } from './MysqlConfig'
import { DataSource, QueryRunner } from 'typeorm'
import { injectable } from 'tsyringe'

@injectable()
export class MysqlDatabase implements IDatabase {

  private dataSource: DataSource

  private queryRunner: QueryRunner

  constructor(
  ) {
    this.dataSource = MysqlConfig
    this.queryRunner = this.dataSource.createQueryRunner()
  }

  isTransactionActive() {
    return this.queryRunner.isTransactionActive
  }

  async startConnection(): Promise<boolean> {

    if (!MysqlConfig.isInitialized) {
      console.log('DATABASE connecting...')
      await MysqlConfig.initialize()
      console.log('DATABASE conected ✅')
    }

    return true
  }

  async startTransaction(): Promise<void> {
    this.queryRunner = this.dataSource.createQueryRunner()
    await this.queryRunner.connect()
    await this.queryRunner.startTransaction()
  }

  async commit(): Promise<boolean> {
    await this.queryRunner.commitTransaction()
    
    return true
  }

  async rollback(): Promise<void> {
    await this.queryRunner.rollbackTransaction()
  }

  async release(): Promise<void> {
    await this.queryRunner.release()
  }

  getConnection(): DataSource {
    return this.dataSource
  }

  getQueryRunner(): QueryRunner {
    return this.queryRunner
  }

}

export default MysqlDatabase
