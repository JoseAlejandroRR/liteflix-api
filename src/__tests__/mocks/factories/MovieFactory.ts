import { CreateMovieDto } from '@/domain/dto/CreateMovieDto'
import MovieStatus from '@/domain/enums/MovieStatus'
import { Movie } from '@/domain/models/Movie'
import { generateNumberRandom } from '@/infra/utils'

class MovieFactory {

  static getCreationData(data?: Partial<Movie>): CreateMovieDto {
    const randomDay = generateNumberRandom(28)
    const randomMonth = generateNumberRandom(12)
    const randomYear = generateNumberRandom(1920, 2024)
    const moviesName = ['Collateral','A Few Good Men','Die Hard 4','The Matrix','Time to Kill']

    return {
      title: data?.title ?? moviesName[generateNumberRandom(0, moviesName.length)],
      imageURL: data?.imageURL ?? 'https://ic.c4assets.com/vps/collateral/b153dba7-45b6-446e-b5d0-c8b7cb7497c1.jpg?imformat=chrome&resize=700px:*',
      thumbnailURL: data?.thumbnailURL ?? 'https://ic.c4assets.com/vps/collateral/b153dba7-45b6-446e-b5d0-c8b7cb7497c1.jpg?imformat=chrome&resize=700px:*',
      status: data?.status ?? Object.values(MovieStatus)[generateNumberRandom(0, 4)],
      rating: data?.rating ?? generateNumberRandom(10),
      releasedAt: data?.releasedAt ?? new Date(`${randomYear}-${randomMonth}-${randomDay}`),
      userId: data?.userId
    }
  }

  static generate(data?: Partial<Movie>): Movie {
    
    const movie = Movie.factory(
      this.getCreationData(data)
    )

    if (data?.id) movie.id

    return movie
  }
}

export default MovieFactory
