import fs from 'fs'
import { S3Client, GetObjectCommand, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { IStorageService } from '@/domain/storage/IStorageService'
import { injectable } from 'tsyringe'
import { getFileNameFromPath, writeFile } from './utils'
import mime from 'mime'

const { AWS_REGION, AWS_BUCKET_NAME } = process.env

const BUCKET_NAME = AWS_BUCKET_NAME

const s3Client = new S3Client({ region: AWS_REGION })

@injectable()
export class S3StorageService implements IStorageService {
  
  async getObject(key: string): Promise<string> {
    try {
      const command = new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
      })
      const data = await s3Client.send(command)
      const { Body } = data

      const blob = await Body!.transformToByteArray()
      const dest = await writeFile(
        getFileNameFromPath(key),
        Buffer.from(blob)
      )

      return dest!
    } catch (error) {
      console.error('[getObject] Error:', error)
    }
    return ''
  }

  async putObject(key: string, path: string): Promise<void> {
    try {
      const fileStream = fs.createReadStream(path)
      const contentType = mime.getType(path) || 'application/octet-stream'
      const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        Body: fileStream,
        ContentType: contentType,
      })
      await s3Client.send(command)
    } catch (error) {
      console.error('[putObject] Error:', error)
      throw error
    }
  }

  async deleteObject(key: string): Promise<void> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
      })
      await s3Client.send(command)
    } catch (error) {
      console.error('[deleteObject] Error:', error)
      throw error
    }
  }
}
