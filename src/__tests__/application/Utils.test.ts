import 'dotenv/config'
import 'reflect-metadata'
import 'tsconfig-paths/register'

import { checkFileType, deleteFile, getFileNameFromPath, ImagesExtensionFilter, streamToString, writeFile } from "@/infra/utils"
import { readFile } from 'fs/promises'
import { Readable } from 'stream'

const { TEMP_FOLDER } = process.env


describe('src/infra.utils Tests', () => {


  beforeAll(() => {
    process.env.TEMP_FOLDER = '.'
  })

  test('[utils.createMovie]: should create a local file', async () => {
    const content = 'Hello world'

    const fileDest = await writeFile('file-demo.txt', content)

    expect(fileDest).not.toBe(null)
  })

  test('[utils.createMovie]: should create a local file', async () => {

    const fileDest = './file-demo.txt'

    const checkName = getFileNameFromPath(fileDest!)

    expect(checkName).toBe('file-demo.txt')
  })

  test('[utils.createMovie]: should fail creating a local file', async () => {

    const fileDest = './file-demo.txt'

    const file = new File([], 'picture.jpg')

    const fileDestFinal = await writeFile(fileDest, file)
    const fileDestFail = await writeFile('.//', file)

    expect(fileDestFinal).toBeDefined()
    expect(fileDestFail).toBe(null)
  })

  test('[utils.checkFileType]: should fail deleting local file', async () => {

    const file1 = new File([], 'picture.webp')
    const file2 = new File([], 'picture.jpg')
    const file3 = new File([], 'picture.tiff')

    const format1 = checkFileType(file1, ImagesExtensionFilter)
    const format2 = checkFileType(file2, ImagesExtensionFilter)
    const format3 = checkFileType(file3, ImagesExtensionFilter)

    expect(format1).toBe(true)
    expect(format2).toBe(true)
    expect(format3).toBe(false)
  })

  test('[utils.createMovie]: should delete a local file', async () => {

    const fileDest = './file-demo.txt'

    const deleteAction = await deleteFile(fileDest!)

    expect(deleteAction).toBe(true)
  })

  test('[utils.createMovie]: should fail deleting local file', async () => {

    const fileDest = './files-demo.txts'

    const deleteAction = await deleteFile(fileDest!)

    expect(deleteAction).toBe(false)
  })

  it('[utils.streamToString] should convert a Readable stream to a string', async () => {
    const readableStream = new Readable()
    readableStream.push('Hello, world!')
    readableStream.push(null)

    const result = await streamToString(readableStream)
    expect(result).toBe('Hello, world!')
  })

})