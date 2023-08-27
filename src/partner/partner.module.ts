import { Module } from '@nestjs/common';
import { PartnerController } from './partner.controller';
import { PartnerService } from './partner.services';
import { JwtModule } from '@nestjs/jwt';
import { PaginationModule } from 'src/pagination/pagination.module';

@Module({
  imports: [JwtModule, PaginationModule],
  controllers: [PartnerController],
  providers: [PartnerService],
})
export class PartnerModule {}
