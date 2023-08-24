import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dto';

@Injectable()
export class ProductService {
  constructor(private readonly prismaService: PrismaService) {}
  async createProduct(data: CreateProductDto) {
    try {
      return await this.prismaService.product.create({
        data: {
          ...data,
        },
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async deleteProduct(productId: string) {
    try {
      const product = await this.prismaService.product.findUnique({
        where: { id: productId },
      });
      if (!product) {
        throw new NotFoundException(`Concept with ID ${productId} not found`);
      }
      // Remove the product from associated partnerProducts.
      await this.prismaService.partnerProduct.deleteMany({
        where: { productId: productId },
      });

      // Remove the product from associated conceptProducts.
      await this.prismaService.conceptProduct.deleteMany({
        where: { productId: productId },
      });

      // Delete the product itself.
      return await this.prismaService.product.delete({
        where: { id: productId },
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async updateProduct(productId: string, updateData: CreateProductDto) {
    try {
      const product = this.prismaService.product.findUnique({
        where: { id: productId },
      });

      if (!product) {
        throw new NotFoundException(`Concept with ID ${productId} not found`);
      }

      return await this.prismaService.product.update({
        where: { id: productId },
        data: updateData,
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async getAllProducts() {
    return this.prismaService.product.findMany();
  }

  private handlePrismaError(error: any) {
    switch (error.code) {
      case 'P2002':
        throw new ConflictException('Unique constraint violation.');
      case 'P2016':
        throw new NotFoundException('Record not found.');
      case 'P2003':
        throw new BadRequestException('Foreign key constraint failed.');
      case 'P2001':
      default:
        throw new InternalServerErrorException(
          'An internal server error occurred.',
        );
    }
  }
}
