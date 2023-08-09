import {
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  Body,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { CloudStorageService } from 'src/cloud-storage/cloudStorage.service';
import { AdminService } from './admin.service';
import { ConceptDto } from './dto';

@Controller('concepts')
export class AdminController {
  constructor(
    private config: ConfigService,
    private cloudStorage: CloudStorageService,
    private adminService: AdminService,
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  @Roles('ADMIN')
  @UseInterceptors(FilesInterceptor('images'))
  async createConcept(@UploadedFiles() images, @Body() dto: ConceptDto) {
    const bucketName = this.config.get('BUCKET_NAME');

    const imageUrls = await Promise.all(
      images.map((image) => this.cloudStorage.upload(image, bucketName)),
    );

    dto.images = imageUrls;

    return this.adminService.create(dto);
  }
}
