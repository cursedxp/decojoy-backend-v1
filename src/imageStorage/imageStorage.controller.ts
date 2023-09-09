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
import { AuthGuard } from 'src/auth/auth.guard';
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
