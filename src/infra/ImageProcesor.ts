import sharp, { FitEnum } from 'sharp'

interface ImageOptions {
  width?: number;
  height?: number;
  quality?: number;
  fit?: keyof FitEnum;
  originalSize?: boolean;
}

interface GenerateFromImageParams {
  originPath: string;
  outputPath: string;
  options?: ImageOptions;
}

class ImageProcessor {
  async generateFromImage({ originPath, outputPath, options = {} }: GenerateFromImageParams): Promise<void> {
    const opc: ImageOptions = {
      width: 800,
      height: 500,
      quality: 75,
      fit: 'cover',
      originalSize: false,
      ...options
    };

    await sharp(originPath)
      .resize(opc.originalSize ? undefined : { width: opc.width, height: opc.height, fit: opc.fit })
      .webp({
        quality: opc.quality,
      })
      .toFile(outputPath);
  }
}

export default ImageProcessor
