import { Controller, Body, Post, UseGuards } from '@nestjs/common';
import { LikeProductService } from './likeProduct.service';
import { LikeProductDto } from './dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('like-product')
export class LikeProductController {
  constructor(private readonly likeProductService: LikeProductService) {}
  @UseGuards(AuthGuard)
  @Roles('USER')
  @Post(':productId/like')
  async likeProduct(@Body() likeProductDto: LikeProductDto) {
    return this.likeProductService.likeProduct(likeProductDto);
  }
}
