import {
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  InternalServerErrorException,
} from '@nestjs/common';
import { ImageStorageService } from './imageStorage.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { ConfigService } from '@nestjs/config';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { VisionService } from 'src/vision-service/vision-service';
import { ImageOperationsService } from 'src/image-operations/image-operations.service';
import { Vertex } from 'src/image-operations/image-operations.service';

// ... [rest of the imports]

@Controller('images')
export class ImageStorageController {
  constructor(
    private imageService: ImageStorageService,
    private config: ConfigService,
    private vision: VisionService,
    private imageOps: ImageOperationsService,
  ) {}

  @Post('upload')
  @UseGuards(AuthGuard)
  @Roles('ADMIN')
  @UseInterceptors(FilesInterceptor('images'))
  async uploadImage(@UploadedFiles() images: Express.Multer.File[]) {
    const imageUrls = [];
    const croppedImageUrls = [];

    try {
      for (const image of images) {
        const url = await this.imageService.uploadAndCreateMetadata(
          image,
          this.config.get('BUCKET_NAME'),
        );
        imageUrls.push(url);
      }

      const visionResults = await this.vision.detectObjects({ imageUrls });
      for (let i = 0; i < visionResults.length; i++) {
        const analysis = visionResults[i];
        const filenameFromUrl = new URL(imageUrls[i]).pathname.split('/').pop(); // This extracts the original file name
        const imageBuffer = await this.imageService.getImageBuffer(
          filenameFromUrl,
          this.config.get('BUCKET_NAME'),
        );

        // To store the cropped URLs for this image.
        const thisImageCroppedUrls = [];

        analysis.forEach(async (detectedObject) => {
          if (
            detectedObject.boundingPoly &&
            detectedObject.boundingPoly.normalizedVertices
          ) {
            const imageDimensions = await this.imageOps.getImageDimensions(
              imageBuffer,
            );
            const pixelVertices: Vertex[] =
              detectedObject.boundingPoly.normalizedVertices.map((v) => ({
                x: v.x * imageDimensions.width,
                y: v.y * imageDimensions.height,
              }));

            const croppedImageBuffer = await this.imageOps.cropImage(
              imageBuffer,
              pixelVertices,
            );
            const croppedUrl = await this.imageService.uploadCroppedImage(
              croppedImageBuffer,
              filenameFromUrl, // pass the original filename here
              this.config.get('BUCKET_NAME'),
            );

            thisImageCroppedUrls.push(croppedUrl);
          }
        });

        // If multiple cropped images were produced from one image, we store all their URLs.
        if (thisImageCroppedUrls.length) {
          croppedImageUrls.push(thisImageCroppedUrls);
        }
      }

      this.vision.saveResults({
        imageUrls: imageUrls,
        visionResults: visionResults,
      });

      return {
        status: 'success',
        data: {
          imageUrls: imageUrls,
          croppedImageUrls: croppedImageUrls, // This will be an array of arrays now.
          analysis: visionResults,
        },
      };
    } catch (error) {
      console.error('Error occurred:', error.message);
      throw new InternalServerErrorException(error.message);
    }
  }
}
