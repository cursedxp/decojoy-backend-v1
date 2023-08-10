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

@Controller('images')
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
    const imageUrls = []; // Array to store public URLs
    console.log(images);
    try {
      for (const image of images) {
        // Use a combined method to upload the image and save metadata
        const url = await this.imageService.uploadAndCreateMetadata(
          image,
          this.config.get('BUCKET_NAME'),
        );
        imageUrls.push(url);
      }
    } catch (error) {
      // Handle any unexpected errors here. NestJS will also catch these automatically if not handled here.
      throw new InternalServerErrorException(error.message);
    }

    return {
      status: 'success',
      imageUrls: imageUrls,
    };
  }
}
