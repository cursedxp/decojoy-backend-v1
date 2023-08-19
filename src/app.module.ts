import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AdminModule } from './admin/admin.module';
import { ImageStorageModule } from './image-storage/imageStorage.module';
import { VisionService } from './vision-service/vision-service';
import { ImageOperationsService } from './image-operations/image-operations.service';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    AdminModule,
    ImageStorageModule,
  ],
  providers: [VisionService, ImageOperationsService],
})
export class AppModule {}
