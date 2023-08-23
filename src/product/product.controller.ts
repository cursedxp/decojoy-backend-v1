import { Controller, Post } from '@nestjs/common';

@Controller('products')
export class ProductController {
  @Post('create')
  createProduct() {
    console.log();
  }
}
