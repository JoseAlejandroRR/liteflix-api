
import { MigrationInterface, QueryRunner, Table } from 'typeorm'
import UserRole from './../../domain/enums/UserRole'
import { TABLE_USERS } from './../../domain/models/User'

export class CreateUsersTable1729902255088 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {

    await queryRunner.createTable(
      new Table({
        name: TABLE_USERS,
        columns: [
          {
            name: 'id',
            type: 'varchar',
            isPrimary: true,
          },
          {
            name: 'firstname',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'lastname',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'email',
            type: 'varchar',
            isNullable: false,
            isUnique: true,
          },
          {
            name: 'password',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'role',
            type: 'enum',
            enum: Object.keys(UserRole),
            default: `'${UserRole.USER}'`,
          },
          {
            name: 'picture_url',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(TABLE_USERS)
  }

}
