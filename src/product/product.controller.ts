import {
  Controller,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto';
import { PaginationDto } from 'src/pagination/dto';

@Controller('products')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Post('create')
  async create(@Body() createProductDto: CreateProductDto) {
    return this.productService.createProduct(createProductDto);
  }

  @Delete(':productId')
  async delete(@Param('productId') productId: string) {
    return this.productService.deleteProduct(productId);
  }

  @Put(':conceptId')
  async update(
    @Param('productId') productId: string,
    @Body() updateConceptDto: CreateProductDto,
  ) {
    return this.productService.updateProduct(productId, updateConceptDto);
  }
  @Get()
  async getProducts(@Query() paginationDto: PaginationDto) {
    return this.productService.getAllProducts(paginationDto);
  }
}
