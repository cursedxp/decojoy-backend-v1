import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFiles,
  InternalServerErrorException,
  UseGuards,
} from '@nestjs/common';
import { ImageStorageService } from './imageStorage.service';
import { ConfigService } from '@nestjs/config';
import { FilesInterceptor } from '@nestjs/platform-express';
import { RolesGuard } from 'src/auth/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/auth/roles.decorator';

@Controller('assets')
export class ImageStorageController {
  constructor(
    private imageService: ImageStorageService,
    private config: ConfigService,
  ) {}
  @UseGuards(RolesGuard, AuthGuard('auth0'))
  @Post('upload')
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

      return {
        status: 'success',
        data: {
          imageUrls: imageUrls,
        },
      };
    } catch (error) {
      console.error('Error occurred:', error.message);
      throw new InternalServerErrorException(error.message);
    }
  }
}
