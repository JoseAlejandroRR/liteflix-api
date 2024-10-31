
import axios from 'axios'

interface ImageOptions {
  width?: number;
  height?: number;
  quality?: number;
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
    console.log('generateExternalThumbnail started')
    const endpoint = `${String(AWS_LAMBDA_RESIZER_URL)}?imageURL=${imageKey}`
    console.log('Endpoint to generate: ', endpoint);
    const response = await axios.post(endpoint);

    const data: Record<string, any> = response.data;
    console.log("generateExternalThumbnail: ", data);

    return data;
  } catch (error) {
    console.error('[generateExternalThumbnail] Error:', error);
  }
  return null;
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
    }

    /*await sharp(originPath)
      .resize(opc.originalSize ? undefined : { width: opc.width, height: opc.height, fit: opc.fit })
      .webp({
        quality: opc.quality,
      })
      .toFile(outputPath);*/
  }

  async generateFromS3Key(key: string): Promise<string | undefined> {
    const json = await generateExternalThumbnail(key)
    if (!json) return undefined;

    return json.thumbnailURL
  }
}

export default ImageProcessor
