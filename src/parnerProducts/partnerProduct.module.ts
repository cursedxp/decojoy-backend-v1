import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PartnerProductsController } from './partnerProduct.controller';
import { PartnerProductsServices } from './parnerProduct.services';
@Module({
  imports: [JwtModule],
  controllers: [PartnerProductsController],
  providers: [PartnerProductsServices],
})
export class PartnerProductsModule {}
