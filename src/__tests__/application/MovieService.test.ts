import 'dotenv/config'
import 'reflect-metadata'
import 'tsconfig-paths/register'

import MovieService from '@/application/services/MovieService'
import { Movie } from '@/domain/models/Movie'
import { IMovieRepository } from '@/domain/repositories/IMovieRepository'
import { MockEventBus } from '../mocks/MockEventBust'
import MockMovieRepository from '../mocks/MockMovieRepository'
import { IEvent } from '@/domain/events/IEvent'
import { CreateMovieDto } from '@/domain/dto/CreateMovieDto'
import MovieFactory from '../mocks/factories/MovieFactory'
import { AuthSession } from '@/domain/security'
import { User } from '@/domain/models/User'
import UserRole from '@/domain/enums/UserRole'
import { EventType } from '@/domain/events/EventType'
import MovieStatus from '@/domain/enums/MovieStatus'
import { UpdateMovieDto } from '@/domain/dto/UpdateMovieDto'
import EntityNotFoundException from '@/domain/exceptions/EntityNotFoundException'
import UnauthorizedUserException from '@/domain/exceptions/UnauthorizedUserException'
import { UserMovie } from '@/domain/models/UserMovie'
import { getUUID } from '@/infra/utils'

describe('src/application/MovieService Unit Tests', () => {
  let movieService: MovieService
  let mockMovieRepository: IMovieRepository
  let mockEventBus: MockEventBus
  let movieZero: Movie
  let auth: AuthSession

  const handler = jest.fn(async (event: IEvent) => {
    //console.log(`Evento called: ${event.name}`);
  })

  beforeEach(async () => {
    const user = new User()
    user.id = 'uuid'
    user.firstname = 'Admin'
    user.lastname = 'Main'
    user.role = UserRole.ADMIN

    auth = {
      user,
      isAnonymous: false
    }

    mockMovieRepository = new MockMovieRepository()
    mockEventBus = new MockEventBus()
    movieService = new MovieService(
      mockMovieRepository,
      mockEventBus
    )

    const data: CreateMovieDto = MovieFactory.getCreationData({
      title: 'A Few Good Man',
      status: MovieStatus.ACTIVE,
      rating: 9,
      releasedAt: new Date(`1996-10-12`),
      userId: user.id
    })

    movieZero = await movieService.createMovie(data, auth)
  })

  afterEach(() => {
    mockEventBus.clearSubscriptions()
  })

  test('[MovieService.createMovie]: should create an movie with the Service', async () => {

    const movieData: CreateMovieDto = MovieFactory.getCreationData({
      title: 'Die Hard 4',
      rating: 7,
      status: MovieStatus.DRAFT
    })

    mockEventBus.on(EventType.Movie.Created, handler)

    const movie = await movieService.createMovie(movieData, auth)

    expect(movie).toBeDefined()
    expect(movie.title).toBe('Die Hard 4')
    expect(movie.rating).toBe(7)
    expect(movie.status).toBe(MovieStatus.DRAFT)
    expect(mockEventBus.getSubscribedEvents()[0]).toBe(EventType.Movie.Created)
    expect(handler).toHaveBeenCalled()

  })
  
  test('[MovieService.updateMovie]: should update an existing Movie ', async () => {

    const data: UpdateMovieDto = {
     title: 'A Few Good Men',
     description: 'Jack Nicholson Best Performance Ever',
     status: MovieStatus.ACTIVE,
     rating: 8,
     imageURL: 'http://s3.amazon.com/new-file.webp',
     thumbnailURL: 'http://s3.amazon.com/thumbnail_new-file.webp',
     releasedAt: new Date()
    }

    mockEventBus.on(EventType.Movie.Updated, handler)

    const movieUpdated = await movieService.updateMovie(movieZero.id, data, auth)

    expect(movieUpdated).toBeDefined();
    expect(movieUpdated.title).toBe(data.title);
    expect(movieUpdated.status).toBe(MovieStatus.ACTIVE)
    expect(handler).toHaveBeenCalled()
    expect(mockEventBus.getSubscribedEvents()[0]).toBe(EventType.Movie.Updated)

  })

  
  test('[MovieService.getMovieById]: should get Movie Entity with the Service', async () => {

    const movie = await movieService.getMovieById(movieZero.id)

    expect(movie).toBeDefined()
    expect(movie.title).toBe('A Few Good Man')
    expect(movie.status).toBe(MovieStatus.ACTIVE)

  })

  test('[MovieService.getMovieListByUser]: should get Movie Entity with the Service', async () => {

    const data = await movieService.getMovieListByUser(auth.user!)

    expect(data.results).toBeInstanceOf(Array)
    expect(data.results.length).toBeGreaterThan(0)
    expect(data.total).toBeGreaterThan(0)

  })

  test('[MovieService.getDaftMovies]: should get Movie Entity with the Service', async () => {

    const results = await movieService.getDaftMovies(auth.user!)

    expect(results).toBeInstanceOf(Array<Movie>)

  })

  test('[MovieService.getMovieById]: should throw EntityNotFoundException', async () => {

    await expect(async () => await movieService.getMovieById('invalidId'))
      .rejects.toThrow(EntityNotFoundException)

  })

  test('[MovieService.getAllMovies]: should get two Entities', async () => {

    const data: CreateMovieDto = MovieFactory.generate({
      id: 'abc'
    })

    await movieService.createMovie(data, auth)

    const movies = await movieService.getAllMovies()

    expect(movies.length).toBe(2)

  })

  test('[MovieService.getMovieById]: should delete the only Record', async () => {

    await movieService.deleteMovie(movieZero, auth)

    const movies = await movieService.getAllMovies()

    expect(movies.length).toBe(0)

  })

  test('[MovieService.getMovieById]: should throw UnauthorizedUserException', async () => {

    const user = new User()
    user.id = getUUID()
    user.firstname = 'Demo'
    user.lastname = 'User'
    user.role = UserRole.CUSTOMER

    auth = {
      user,
      isAnonymous: false
    }
    await expect(async () => await movieService.deleteMovie(movieZero, auth))
      .rejects.toThrow(UnauthorizedUserException)

  })
  
  test('[User.addMovieToList]: should create UserMovie instance', async () => {

    const { user } = auth
    const userMovie = user?.addMovieToList(movieZero)

    expect(userMovie).toBeDefined()
    expect(userMovie).toBeInstanceOf(UserMovie)
  })
  
})