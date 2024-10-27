import ViewModel from '../ViewModel'
import { Movie } from '@/domain/models/Movie'

class MovieViewModel extends ViewModel<Movie> {
  constructor(movie: Movie) {
    const view: Record<string, any> = {
      id: movie.id,
      title: movie.title ?? '',
      description: movie.description ?? '',
      status: movie.status,
      imageURL: movie.imageURL ?? '',
      thumbnailURL: movie.thumbnailURL ?? '',
      rating: Number(movie.rating?.toFixed(1)),
      releasedAt: movie.releasedAt,
      createdAt: movie.createdAt,
      updatedAt: movie.updatedAt,
    }

    super(view)
  }
}

export default MovieViewModel
