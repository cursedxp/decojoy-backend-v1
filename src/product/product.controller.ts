import { Controller, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto';
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
}
