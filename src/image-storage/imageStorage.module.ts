import { Module } from '@nestjs/common';
import { ImageStorageService } from './imageStorage.service';
import { ImageStorageController } from './imageStorage.controller';
import { JwtModule } from '@nestjs/jwt';
import { VisionService } from 'src/vision-service/vision-service';
import { ImageOperationsService } from 'src/image-operations/image-operations.service';

@Module({
  imports: [JwtModule],
  providers: [ImageStorageService, VisionService, ImageOperationsService],
  controllers: [ImageStorageController],
})
export class ImageStorageModule {}
