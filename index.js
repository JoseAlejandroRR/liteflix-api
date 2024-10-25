import 'dotenv/config'
import fs from 'fs'
import { Hono } from 'hono'
import { v4 as uuidv4 } from 'uuid'
import { getObjectFromS3, putObjectToS3, deleteObjectFromS3, saveDataToS3, DATABASE_FILENAME } from './src/infra/S3Client.js'
import { serve } from '@hono/node-server'
import { handle } from 'hono/aws-lambda'
import { cors } from 'hono/cors'


const { PORT } = process.env

const app = new Hono()
app.use('*', cors({
  origin: [String('http://localhost:5174')]
}))

let movies = []

const loadMoviesFromS3 = async () => {
  try {
    movies = await getObjectFromS3(DATABASE_FILENAME)
    console.log(movies)
  } catch (error) {
    console.error('[loadMoviesFromS3] Error:', error)
    movies = []
  }
}

const saveMoviesToS3 = async () => {
  try {
    await saveDataToS3(movies)
  } catch (error) {
    console.error('[saveMoviesToS3] Error:', error)
  }
}

app.get('/health', (c) => {
  const currentTime = new Date().toISOString()
  return c.json({ status: 'healthy', currentTime })
})

app.get('/api/v1/movies', (c) => {
  return c.json(movies)
})


app.get('/api/v1/movies/:id', (c) => {
  const { id } = c.req.param()

  const movieIndex = movies.find((movie) => movie.id === id)
  if (!movieIndex) {
    return c.json({ error: 'NOT_FOUND' }, 404)
  }
  return c.json(movieIndex)
})


app.post('/api/v1/movies', async (c) => {
  const formData = await c.req.parseBody()
  const { title, description } = formData
  const file = formData.file

  if (!title || !file) return c.json({ error: 'INVALID_REQUEST' }, 400)

  const fileKey = `movies/${uuidv4()}-${file.name}`

  const arr = await file.arrayBuffer()
  fs.writeFileSync(file.name, Buffer.from(arr), (err) => {
    if (err) throw err
  })

  await putObjectToS3(fileKey, `./${file.name}`)

  const newMovie = {
    id: uuidv4(),
    title,
    description,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    fileKey: fileKey,
    imageURL: `https://image-resizer-testing-01.s3.us-east-1.amazonaws.com/${fileKey}`,
    thumbnailURL: `https://image-resizer-testing-01.s3.us-east-1.amazonaws.com/${fileKey}`
  }

  movies.push(newMovie)
  await saveMoviesToS3()

  fs.rm(`./${file.name}`)

  return c.json(newMovie)
})


app.delete('/api/v1/movies/:id', async (c) => {
  const { id } = c.req.param()

  const movieIndex = movies.find((movie) => movie.id === id)

  if (!movieIndex) {
    return c.json({ error: 'NOT_FOUND' }, 404)
  }

  const arr = movies.filter((movie) => movie.id !== id)

  movies = [...arr]
  await deleteObjectFromS3(movieIndex.fileKey) 
  await saveMoviesToS3()

  return c.json({ message: 'success' })
})


export const handler = async (event, context) => {
  await loadMoviesFromS3()
  return handle(app)(event, context)
}

if (PORT) {

  serve({
      fetch: app.fetch,
      port: Number(PORT),
    },
    async (info) => {
      console.log(`Server at: http://${info.address}:${info.port}`)
      await loadMoviesFromS3()
    }
  )
}
