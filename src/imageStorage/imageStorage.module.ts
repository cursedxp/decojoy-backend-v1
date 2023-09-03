import { Module } from '@nestjs/common';
import { ImageStorageService } from './imageStorage.service';
import { ImageStorageController } from './imageStorage.controller';

@Module({
  providers: [ImageStorageService],
  controllers: [ImageStorageController],
})
export class ImageStorageModule {}
