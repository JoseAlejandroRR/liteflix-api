import ViewModel from '../ViewModel'
import { Movie } from '@/domain/models/Movie'

const { AWS_BUCKET_PUBLIC_URL } = process.env

class MovieViewModel extends ViewModel<Movie> {
  constructor(movie: Movie) {

    let imageURL = movie.imageURL ?? null
    let thumbnailURL = movie.thumbnailURL ?? null

    if (imageURL && !imageURL.includes('http')) imageURL = `${AWS_BUCKET_PUBLIC_URL}/${imageURL}`
    if (thumbnailURL && !thumbnailURL.includes('http')) thumbnailURL = `${AWS_BUCKET_PUBLIC_URL}/${thumbnailURL}`

    const view: Record<string, any> = {
      id: movie.id,
      title: movie.title ?? '',
      description: movie.description ?? '',
      status: movie.status,
      imageURL,
      thumbnailURL,
      rating: Number(movie.rating?.toFixed(1)),
      releasedAt: movie.releasedAt,
      createdAt: movie.createdAt,
      updatedAt: movie.updatedAt,
    }

    super(view)
  }
}

export default MovieViewModel
