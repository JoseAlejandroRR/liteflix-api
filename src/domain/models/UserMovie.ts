import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm'
import { User } from './User'
import { Movie } from './Movie'

export const TABLE_USER_MOVIES = 'my_movies'

@Entity(TABLE_USER_MOVIES)
export class UserMovie extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ name: 'user_id', type: 'uuid' })
  userId!: string

  @Column({ name: 'movie_id', type: 'uuid' })
  movieId!: string

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt!: Date

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User

  @ManyToOne(() => Movie, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'movie_id' })
  movie!: Movie
}
