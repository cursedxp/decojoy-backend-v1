import { Module } from '@nestjs/common';
import { LikeProductService } from './likeProduct.service';

@Module({
  providers: [LikeProductService],
})
export class LikeProductModule {}
