import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm'
import { TABLE_MOVIES } from './../../domain/models/Movie'
import { TABLE_USERS } from './../../domain/models/User'
import { TABLE_USER_MOVIES } from './../../domain/models/UserMovie'

export class CreateTableMyMovies1729986001983 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'my_movies',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            isPrimary: true,
          },
          {
            name: 'user_id',
            type: 'varchar',
          },
          {
            name: 'movie_id',
            type: 'varchar',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
      true
    )

    await queryRunner.createForeignKey(
      TABLE_USER_MOVIES,
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: TABLE_USERS,
        onDelete: 'CASCADE',
      })
    )

    await queryRunner.createForeignKey(
      TABLE_USER_MOVIES,
      new TableForeignKey({
        columnNames: ['movie_id'],
        referencedColumnNames: ['id'],
        referencedTableName: TABLE_MOVIES,
        onDelete: 'CASCADE',
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(TABLE_USER_MOVIES)
  }

}
