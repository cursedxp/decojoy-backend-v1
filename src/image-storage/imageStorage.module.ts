import { Module } from '@nestjs/common';
import { ImageStorageService } from './imageStorage.service';
import { ImageStorageController } from './imageStorage.controller';
import { JwtModule } from '@nestjs/jwt';
import { VisionService } from 'src/vision-service/vision-service';

@Module({
  imports: [JwtModule],
  providers: [ImageStorageService, VisionService],
  controllers: [ImageStorageController],
})
export class ImageStorageModule {}
