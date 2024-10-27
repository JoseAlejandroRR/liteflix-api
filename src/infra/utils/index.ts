
import fs from 'fs/promises'
import { v4 } from 'uuid'

const { TEMP_FOLDER } = process.env

export const ImagesExtensionFilter = ['gif', 'png', 'jpg', 'jpeg', 'webp']

export const checkFileType = (file: File, extensions: string[]) => {

    if (file?.name) {
        const fileType = file.name.split(".").pop();
        if (extensions.includes(fileType!)) return true
    }
    return false
}

export const writeFile = async (
  filePath: string, file: string | File | Buffer
): Promise<string | null> => {
  const dest = `${TEMP_FOLDER}/${filePath}`
  try {
    if (typeof file === 'string' || file instanceof Buffer) {
      await fs.writeFile(dest, file);
    } else if (file instanceof File) {
      const arr = await file.arrayBuffer()
      await fs.writeFile(dest, Buffer.from(arr))
    }
    return dest
  } catch (err) {
    console.error('[writeFile] Error:', err);
  }

  return null
}

export const deleteFile = async (filePath: string): Promise<boolean> => {
  const dest = `${TEMP_FOLDER}/${filePath}`
  try {
    await fs.rm(dest)

    return true
  } catch (err) {
    console.error('[deleteFile] Error:', err);
  }

  return false
}

export const getUUID = (): string => v4()
