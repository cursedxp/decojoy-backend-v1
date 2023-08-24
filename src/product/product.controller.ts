import {
  Controller,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
@Controller('products')
export class ProductController {
  constructor(private productService: ProductService) {}
  @Post('create')
  @UseGuards(AuthGuard)
  @Roles('ADMIN')
  async create(@Body() createProductDto: CreateProductDto) {
    return this.productService.createProduct(createProductDto);
  }
  @Delete(':productId')
  @UseGuards(AuthGuard)
  @Roles('ADMIN')
  async delete(@Param('productId') productId: string) {
    return this.productService.deleteProduct(productId);
  }
  @Put(':conceptId')
  @UseGuards(AuthGuard)
  @Roles('ADMIN')
  async update(
    @Param('productId') productId: string,
    @Body() updateConceptDto: CreateProductDto,
  ) {
    return this.productService.updateProduct(productId, updateConceptDto);
  }
}
