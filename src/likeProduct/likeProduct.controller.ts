import { Controller, Body, Post } from '@nestjs/common';
import { LikeProductService } from './likeProduct.service';
import { LikeProductDto } from './dto';

@Controller('like-product')
export class LikeProductController {
  constructor(private readonly likeProductService: LikeProductService) {}

  @Post(':productId/like')
  async likeProduct(@Body() likeProductDto: LikeProductDto) {
    return this.likeProductService.likeProduct(likeProductDto);
  }
}
