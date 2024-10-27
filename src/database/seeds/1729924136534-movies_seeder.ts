import { Movie } from './../../domain/models/Movie'
import { User } from './../../domain/models/User'
import MovieStatus from './../../domain/enums/MovieStatus'
import { DataSource } from 'typeorm'
import { Seeder } from 'typeorm-extension'
import { UserMovie } from './../../domain/models/UserMovie'

export class MoviesSeeder1729924136534 implements Seeder {
  track = false;

  public async run(
      dataSource: DataSource,
  ): Promise<any> {
    const repository =  dataSource.getRepository(Movie)
    const userRepository =  dataSource.getRepository(User)
    const myMoviesRepository =  dataSource.getRepository(UserMovie)
    const hasRecords = await repository.find()
    if (hasRecords.length > 0) return     

    const manager = await userRepository.findOne({
      where: {
        email: 'josealejandror28@gmail.com'
      }
    })

    const userDemo = await userRepository.findOne({
      where: {
        email: 'demo@demo.com'
      }
    })

    if (!manager) return

    const movies = [
      Movie.factory({
        title: 'La Isla Siniestra',
        imageURL: 'https://pymstatic.com/5563/conversions/shutter-island-psicologia-wide_webp.webp',
        thumbnailURL: 'https://pymstatic.com/5563/conversions/shutter-island-psicologia-wide_webp.webp',
        status: MovieStatus.ACTIVE,
        rating: 8.5,
        releasedAt: new Date('2010-01-18'),
        userId: manager.id
      }),
      Movie.factory({
        title: 'Cuestión de Honor',
        imageURL: 'https://agendauc-prod.s3.amazonaws.com/large_Cuestion_de_honor_cd1aceec1d.jpg',
        thumbnailURL: 'https://agendauc-prod.s3.amazonaws.com/large_Cuestion_de_honor_cd1aceec1d.jpg',
        status: MovieStatus.ACTIVE,
        rating: 9,
        releasedAt: new Date('1992-10-1'),
        userId: manager.id,
      }),
      Movie.factory({
        title: 'Tiempo para Matar',
        imageURL: 'https://ew.com/thmb/fMTQFsCG9wngA9sJVxUufIFxhUA=/400x262/filters:no_upscale():max_bytes(150000):strip_icc()/a-time-to-kill2-598fecece4144bdd8ceeced67dd58019.jpg',
        thumbnailURL: 'https://ew.com/thmb/fMTQFsCG9wngA9sJVxUufIFxhUA=/400x262/filters:no_upscale():max_bytes(150000):strip_icc()/a-time-to-kill2-598fecece4144bdd8ceeced67dd58019.jpg',
        status: MovieStatus.ACTIVE,
        rating: 9,
        releasedAt: new Date('1996-08-28'),
        userId: manager.id,
      }),
      Movie.factory({
        title: 'Colateral',
        imageURL: 'https://ic.c4assets.com/vps/collateral/b153dba7-45b6-446e-b5d0-c8b7cb7497c1.jpg?imformat=chrome&resize=700px:*',
        thumbnailURL: 'https://ic.c4assets.com/vps/collateral/b153dba7-45b6-446e-b5d0-c8b7cb7497c1.jpg?imformat=chrome&resize=700px:*',
        status: MovieStatus.ACTIVE,
        rating: 7.5,
        releasedAt: new Date('2004-06-20'),
        userId: manager.id,
      }),
    ]

    await repository.save(movies)

    const moviesRecords = await repository.find()

    for(const movie of moviesRecords) {
      await myMoviesRepository.save(manager.addMovieToList(movie))

      if (userDemo) {
        await myMoviesRepository.save(userDemo.addMovieToList(movie))
      }
    }
  
    console.log('✅ Movie Seeder Finished')
  }
}
