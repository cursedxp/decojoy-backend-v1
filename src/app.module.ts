import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AdminModule } from './admin/admin.module';
import { ImageStorageModule } from './image-storage/imageStorage.module';
import { ConceptModule } from './concept/concepts.module';
import { ProductModule } from './product/product.module';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    AdminModule,
    ImageStorageModule,
    ConceptModule,
    ProductModule,
  ],
})
export class AppModule {}
