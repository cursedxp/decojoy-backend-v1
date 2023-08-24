import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { ImageStorageModule } from './imageStorage/imageStorage.module';
import { ConceptModule } from './concept/concepts.module';
import { ProductModule } from './product/product.module';
import { ConceptProductsModule } from './conceptProducts/conceptProducts.module';
import { PartnerModule } from './partner/partner.module';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    ImageStorageModule,
    ConceptModule,
    ProductModule,
    ConceptProductsModule,
    PartnerModule,
  ],
})
export class AppModule {}
