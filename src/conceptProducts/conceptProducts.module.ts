import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PaginationModule } from 'src/pagination/pagination.module';
import { ConceptProductsService } from './conceptProducts.service';

@Module({
  imports: [PaginationModule, JwtModule],
  providers: [ConceptProductsService],
})
export class ConceptProductsModule {}
