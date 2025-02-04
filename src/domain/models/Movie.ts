import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm'
import { User } from './User'
import { CreateMovieDto } from '../dto/CreateMovieDto'
import MovieStatus from '../enums/MovieStatus'
import { UserMovie } from './UserMovie'
import { UpdateMovieDto } from '../dto/UpdateMovieDto'

export const TABLE_MOVIES = 'movies'

@Entity(TABLE_MOVIES)
export class Movie extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ type: 'varchar' })
  title?: string

  @Column({ type: 'varchar' })
  description?: string

  @Column({ name:'released_at', type: 'datetime'})
  releasedAt?: Date

  @Column({ type: 'float' })
  rating?: number

  @Column({ type: 'varchar', name: 'image_url' })
  imageURL?: string

  @Column({ type: 'varchar', name: 'thumbnail_url' })
  thumbnailURL?: string

  @Column({ name: 'user_id', type: 'string', nullable: true })
  userId?: string

  @ManyToOne(() => User, { nullable: true, onDelete: 'CASCADE'  })
  @JoinColumn({ name: 'user_id' })
  user?: User

  @Column({ type: 'enum', enum: MovieStatus })
  status!: MovieStatus
  
  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt!: Date

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt!: Date

  @OneToMany(() => UserMovie, (userMovie) => userMovie.movie)
  users?: UserMovie[]

  static factory(input: CreateMovieDto): Movie {
    const movie = new Movie()

    movie.title = input.title
    movie.description = input.description
    movie.status = input.status ?? MovieStatus.DRAFT
    movie.releasedAt = input.releasedAt
    movie.rating = input.rating
    movie.imageURL = input.imageURL
    movie.thumbnailURL = input.thumbnailURL
    movie.userId = input.userId

    return movie
  }

  update(changes: UpdateMovieDto): void {

    if (changes.title !== undefined) {
      this.title = changes.title
    }

    if (changes.description !== undefined) {
      this.description = changes.description
    }

    if (changes.status !== undefined) {
      this.status = changes.status
    }

    if (changes.releasedAt !== undefined) {
      this.releasedAt = changes.releasedAt
    }

    if (changes.rating !== undefined) {
      this.rating = changes.rating
    }

    if (changes.imageURL !== undefined) {
      this.imageURL = changes.imageURL
    }

    if (changes.thumbnailURL !== undefined) {
      this.thumbnailURL = changes.thumbnailURL
    }
  }

}
