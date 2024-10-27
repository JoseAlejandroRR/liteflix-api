import MovieStatus from "../enums/MovieStatus"

export class CreateMovieDto {
  title?: string
  description?: string
  status!: MovieStatus
  releasedAt?: Date
  image?: File
  imageURL?: string
  thumbnailURL?: string
  rating?: number
  userId?: string
}
