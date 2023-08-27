import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePartnerProductDto } from 'src/product/dto';
import { UpdatePartnerProductDto } from './dto';
import { PaginationDto } from 'src/pagination/dto';

@Injectable()
export class PartnerProductsServices {
  constructor(private readonly prismaService: PrismaService) {}

  async createPartnerProduct(dto: CreatePartnerProductDto) {
    try {
      return this.prismaService.partnerProduct.create({
        data: {
          partner: { connect: { id: dto.partnerId } },
          product: { connect: { id: dto.productId } },
        },
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async updatePartnerProduct(id: string, dto: UpdatePartnerProductDto) {
    try {
      const partnerProduct = await this.prismaService.partnerProduct.findUnique(
        {
          where: { id },
        },
      );

      if (!partnerProduct) {
        throw new NotFoundException(`Partner Product with ID ${id} not found`);
      }

      return this.prismaService.partnerProduct.update({
        where: { id },
        data: dto,
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async deletePartnerProduct(id: string) {
    try {
      const partnerProduct = await this.prismaService.partnerProduct.findUnique(
        {
          where: { id },
        },
      );

      if (!partnerProduct) {
        throw new NotFoundException(`Partner Product with ID ${id} not found`);
      }

      return this.prismaService.partnerProduct.delete({
        where: { id },
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async getAllPartnerProducts(paginationDto: PaginationDto) {
    const skip = (paginationDto.page - 1) * paginationDto.limit;
    return this.prismaService.partnerProduct.findMany({
      take: paginationDto.limit,
      skip: skip,
      include: {
        partner: true,
        product: true,
      },
    });
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
