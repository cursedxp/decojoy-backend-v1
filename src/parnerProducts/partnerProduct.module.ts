import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PartnerProductsController } from './partnerProduct.controller';
import { PartnerProductsServices } from './parnerProduct.services';
import { PaginationModule } from 'src/pagination/pagination.module';
@Module({
  imports: [JwtModule, PaginationModule],
  controllers: [PartnerProductsController],
  providers: [PartnerProductsServices],
})
export class PartnerProductsModule {}
