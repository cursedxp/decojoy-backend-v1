import { Module } from '@nestjs/common';
import { ImageStorageService } from './imageStorage.service';
import { ImageStorageController } from './imageStorage.controller';
import { JwtModule } from '@nestjs/jwt';
@Module({
  imports: [JwtModule],
  providers: [ImageStorageService],
  controllers: [ImageStorageController],
})
export class ImageStorageModule {}
