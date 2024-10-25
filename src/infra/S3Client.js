import fs from 'fs'
import { S3Client, GetObjectCommand, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'

const REGION = 'us-east-1'
const BUCKET_NAME = 'image-resizer-testing-01'

export const DATABASE_FILENAME = 'movies.json'

const s3Client = new S3Client({ region: REGION })

export const getObjectFromS3 = async (key) => {
  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    })
    const data = await s3Client.send(command)
    
    const streamToString = (stream) =>
      new Promise((resolve, reject) => {
        const chunks = []
        stream.on('data', (chunk) => chunks.push(chunk))
        stream.on('error', reject)
        stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')))
      })

    const bodyContent = await streamToString(data.Body)
    return JSON.parse(bodyContent)
  } catch (error) {
    console.error('[getObjectFromS3] Error:', error)
    throw error
  }
}

export const putObjectToS3 = async (key, path) => {
  try {
    const fileStream = fs.createReadStream(path)
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: fileStream,
      ContentType: 'image/webp',
    })
    await s3Client.send(command)
  } catch (error) {
    console.error('[putObjectToS3] Error:', error)
    throw error
  }
}

export const deleteObjectFromS3 = async (key) => {
  try {
    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    })
    await s3Client.send(command)
  } catch (error) {
    console.error('[deleteObjectFromS3] Error:', error)
    throw error
  }
}

export const saveDataToS3 = async (content) => {
  try {
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: DATABASE_FILENAME,
      Body: JSON.stringify(content),
      ContentType: 'application/json',
    })
    await s3Client.send(command)
  } catch (error) {
    console.error('[saveDataToS3] Error:', error)
    throw error
  }
}
