//import sharp, { FitEnum } from 'sharp'

interface ImageOptions {
  width?: number;
  height?: number;
  quality?: number;
  //fit?: keyof FitEnum;
  originalSize?: boolean;
}

interface GenerateFromImageParams {
  originPath: string;
  outputPath: string;
  options?: ImageOptions;
}

const { AWS_LAMBDA_RESIZER_URL } = process.env

const generateExternalThumbnail = async(
  imageKey: string
): Promise<Record<string, any> | null> => {
  try {
    const response = await fetch(`${String(AWS_LAMBDA_RESIZER_URL)}?imageURL=${imageKey}`, {
      method: 'POST'
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`)
    }

    const data: Record<string, any> = await response.json()
    console.log("generateExternalThumbnail: ",data)

    return data
  } catch (error) {
    console.error('[generateExternalThumbnail] Error:', error);
  }
  return null
}
class ImageProcessor {
  async generateFromImage({ originPath, outputPath, options = {} }: GenerateFromImageParams): Promise<void> {
    const opc: ImageOptions = {
      width: 800,
      height: 500,
      quality: 75,
      //fit: 'cover',
      originalSize: false,
      ...options
    };

    /*await sharp(originPath)
      .resize(opc.originalSize ? undefined : { width: opc.width, height: opc.height, fit: opc.fit })
      .webp({
        quality: opc.quality,
      })
      .toFile(outputPath);*/
  }

  async generateFromS3Key(key: string): Promise<string | undefined> {
    const json = await generateExternalThumbnail(key)
    if (!json) return undefined
    return json.thumbnailURL
  }
}

export default ImageProcessor
