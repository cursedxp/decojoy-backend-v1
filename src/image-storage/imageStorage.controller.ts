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

@Controller('assets')
export class ImageStorageController {
  constructor(
    private imageService: ImageStorageService,
    private config: ConfigService,
  ) {}

  @Post('upload')
  @UseGuards(AuthGuard)
  @Roles('ADMIN')
  @UseInterceptors(FilesInterceptor('images'))
  async uploadImage(@UploadedFiles() images: Express.Multer.File[]) {
    const imageUrls = [];
    // const croppedImageUrls = [];
    // const similarProductUrls = [];

    try {
      for (const image of images) {
        const url = await this.imageService.uploadAndCreateMetadata(
          image,
          this.config.get('BUCKET_NAME'),
        );
        imageUrls.push(url);
      }

      // const visionResults = await this.vision.detectObjects({ imageUrls });

      // for (let i = 0; i < visionResults.length; i++) {
      //   const analysis = visionResults[i];
      //   const filenameFromUrl = new URL(imageUrls[i]).pathname.split('/').pop();
      //   const imageBuffer = await this.imageService.getImageBuffer(
      //     filenameFromUrl,
      //     this.config.get('BUCKET_NAME'),
      //   );

      //   const thisImageCroppedUrls = [];

      //   for (const detectedObject of analysis) {
      //     if (
      //       detectedObject.boundingPoly &&
      //       detectedObject.boundingPoly.normalizedVertices
      //     ) {
      //       const imageDimensions = await this.imageOps.getImageDimensions(
      //         imageBuffer,
      //       );
      //       const pixelVertices: Vertex[] =
      //         detectedObject.boundingPoly.normalizedVertices.map((v) => ({
      //           x: v.x * imageDimensions.width,
      //           y: v.y * imageDimensions.height,
      //         }));

      //       const croppedImageBuffer = await this.imageOps.cropImage(
      //         imageBuffer,
      //         pixelVertices,
      //       );
      //       const croppedUrl = await this.imageService.uploadCroppedImage(
      //         croppedImageBuffer,
      //         filenameFromUrl,
      //         this.config.get('BUCKET_NAME'),
      //       );

      //       thisImageCroppedUrls.push(croppedUrl);
      //     }
      //   }

      //   // Now, for each cropped image of this particular image, get similar products
      //   const similarProductsForThisImage = [];
      //   for (const croppedUrl of thisImageCroppedUrls) {
      //     const similarProducts = await this.vision.findSimilarProducts(
      //       croppedUrl,
      //     );
      //     similarProductsForThisImage.push(
      //       similarProducts.map((product) => product.url),
      //     );
      //   }
      //   similarProductUrls.push(similarProductsForThisImage);

      //   if (thisImageCroppedUrls.length) {
      //     croppedImageUrls.push(thisImageCroppedUrls);
      //   }
      // }

      // await this.vision.saveResults({
      //   imageUrls: imageUrls,
      //   visionResults: visionResults,
      // });

      return {
        status: 'success',
        data: {
          imageUrls: imageUrls,
          // croppedImageUrls: croppedImageUrls,
          // similarProductUrls: similarProductUrls,
          // analysis: visionResults,
        },
      };
    } catch (error) {
      console.error('Error occurred:', error.message);
      throw new InternalServerErrorException(error.message);
    }
  }
}
