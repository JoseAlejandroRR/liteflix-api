import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, BeforeInsert, BeforeUpdate, OneToMany } from 'typeorm'
import UserRole from '../enums/UserRole'
import bcrypt from 'bcryptjs'
import { UserMovie } from './UserMovie'
import { Movie } from './Movie'

export const TABLE_USERS = 'users'
@Entity(TABLE_USERS)
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ type: 'varchar' })
  firstname!: string

  @Column({ type: 'varchar' })
  lastname!: string

  @Column({ type: 'varchar' })
  email!: string

  @Column({ type: 'varchar', nullable: true })
  password?: string

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role!: UserRole

  @Column({ name: 'picture_url', type: 'varchar', nullable: true })
  pictureURL?: string

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt!: Date

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt!: Date

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10)
    }
  }

  @OneToMany(() => UserMovie, (userMovies) => userMovies.user)
  movies!: UserMovie[];

  async checkPassword(password: string): Promise<boolean> {
    if (!this.password) return false
    return bcrypt.compare(password, this.password)
  }

  addMovieToList(movie: Movie): UserMovie {
    const mymovie = new UserMovie()
    mymovie.userId = this.id
    mymovie.movieId = movie.id

    return mymovie
  }
}
