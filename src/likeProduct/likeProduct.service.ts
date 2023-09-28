import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { LikeProductDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LikeProductService {
  constructor(private readonly prismaService: PrismaService) {}
  async likeProduct(data: LikeProductDto) {
    try {
      const { userId, productId } = data;

      const product = await this.prismaService.product.findUnique({
        where: { id: productId },
      });
      if (!product) {
        throw new NotFoundException('Product not found.');
      }

      return this.prismaService.productLike.create({
        data: {
          userAuth0Id: userId,
          productId: productId,
        },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Product already liked by user.');
      }
      throw error;
    }
  }
}
