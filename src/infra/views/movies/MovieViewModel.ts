import ViewModel from '../ViewModel'
import { Movie } from '@/domain/models/Movie'

const { AWS_BUCKET_PUBLIC_URL } = process.env

/**
 * A view model for a Movie Model.
 *
 * @swagger
 * components:
 *   schemas:
 *     MovieViewModel:
 *       description: Movie Object Structure
 *       properties:
 *         id:
 *           type: string
 *           example: 4b7b489e-bb31-4610-b621-6e1c9669d199
 *         title:
 *           type: string
 *           example: Cuestión de Honor
 *         description:
 *           type: string
 *         imageURL:
 *           type: string
 *           example: https://s3.amazon.com/image.jpg
 *         thumbnailURL:
 *           type: string
 *           example: https://s3.amazon.com/thumbail_image.jpg
 *         releasedAt:
 *           type: Date
 *           example: 2020-02-04
 *         rating:
 *           type: number
 *           example: 8.5
 *         status:
 *           type: string
 *           enum: [ACTIVE, INACTIVE, SOON, DRAFT]
 *         createdAt:
 *           type: string
 *           format: date-time
 *           pattern: '^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}\w{1}$'
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           pattern: '^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}\w{1}$'
 */

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
