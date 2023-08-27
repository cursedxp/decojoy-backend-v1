import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { JwtModule } from '@nestjs/jwt';
import { PaginationModule } from 'src/pagination/pagination.module';

@Module({
  imports: [JwtModule, PaginationModule],
  providers: [ProductService],
  controllers: [ProductController],
})
export class ProductModule {}
