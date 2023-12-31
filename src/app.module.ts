import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { ImageStorageModule } from './imageStorage/imageStorage.module';
import { ConceptModule } from './concept/concepts.module';
import { ProductModule } from './product/product.module';
import { ConceptProductsModule } from './conceptProducts/conceptProducts.module';
import { PartnerModule } from './partner/partner.module';
import { LikeProductModule } from './likeProduct/likeProduct.module';
import { PaginationModule } from './pagination/pagination.module';
import { PaypalModule } from './paypal/paypal.module';
import { CartModule } from './cart/cart.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot({ isGlobal: true }),
    ImageStorageModule,
    ConceptModule,
    ProductModule,
    ConceptProductsModule,
    PartnerModule,
    LikeProductModule,
    PaginationModule,
    PaypalModule,
    CartModule,
    AuthModule,
    JwtModule,
  ],
})
export class AppModule {}
