import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm'
import MovieStatus from './../..//domain/enums/MovieStatus'
import { TABLE_MOVIES } from './../../domain/models/Movie'
import { TABLE_USERS } from './../../domain/models/User'

export class CreateMoviesTables1729923334571 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {

    await queryRunner.createTable(
      new Table({
        name: TABLE_MOVIES,
        columns: [
          {
            name: 'id',
            type: 'varchar',
            isPrimary: true,
          },
          {
            name: 'title',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'description',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'image_url',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'thumbnail_url',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'enum',
            enum: Object.keys(MovieStatus),
            default: `'${MovieStatus.DRAFT}'`,
          },
          {
            name: 'released_at',
            type: 'datetime',
            isNullable: true,
          },
          {
            name: 'rating',
            type: 'float',
            isNullable: true,
          },
          {
            name: 'user_id',
            type: 'varchar',
            isNullable: false,
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
  
    await queryRunner.createForeignKey(
      TABLE_MOVIES,
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: TABLE_USERS,
        onDelete: 'CASCADE',
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(TABLE_MOVIES)
  }

}
