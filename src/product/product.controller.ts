import {
  Controller,
  Post,
  Body,
  Request,
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
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('ADMIN')
@Controller('products')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Post()
  async create(
    @Body() createProductDto: CreateProductDto,
    @Request() request: Request,
  ) {
    const payload = request['user'];
    return this.productService.createProduct(createProductDto, payload);
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
