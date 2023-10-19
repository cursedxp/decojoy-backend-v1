import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddProductToConceptDto } from './dto';
import { CreateAndAddProductToConceptDto } from './dto/createAndAddProduct.dto';
import { PaginationDto } from 'src/pagination/dto';

@Injectable()
export class ConceptProductsService {
  constructor(private readonly prismaService: PrismaService) {}

  async createProductAndAddToConcept(data: CreateAndAddProductToConceptDto) {
    try {
      const createdProduct = await this.prismaService.product.create({
        data: {
          title: data.title,
          image: data.image,
          thumbnail: data.thumbnail,
          description: data.description,
          category: data.category,
          price: data.price,
          url: data.url,
        },
      });

      await this.prismaService.conceptProduct.create({
        data: {
          concept: { connect: { id: data.conceptId } },
          product: { connect: { id: createdProduct.id } },
        },
      });

      // Associate product with partner, if specified.
      if (data.partnerId || data.newPartnerName) {
        await this.addProductToPartner(
          data.partnerId,
          data.newPartnerName,
          createdProduct.id,
        );
      }
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async addProductToConcept(data: AddProductToConceptDto) {
    try {
      const conceptProduct = await this.prismaService.conceptProduct.create({
        data: {
          concept: { connect: { id: data.conceptId } },
          product: { connect: { id: data.productId } },
        },
      });

      // Associate product with partner, if specified.
      if (data.partnerId || data.newPartnerName) {
        await this.addProductToPartner(
          data.partnerId,
          data.newPartnerName,
          data.productId,
        );
      }

      return conceptProduct;
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async removeProductFromConcept(data: AddProductToConceptDto) {
    try {
      return this.prismaService.conceptProduct.delete({
        where: {
          conceptId_productId: {
            conceptId: data.conceptId,
            productId: data.productId,
          },
        },
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async getAllConceptProducts(paginationDto: PaginationDto) {
    const skip = (paginationDto.page - 1) * paginationDto.limit;
    return this.prismaService.conceptProduct.findMany({
      take: paginationDto.limit,
      skip: skip,
      include: {
        concept: true,
        product: true,
      },
    });
  }

  private async addProductToPartner(
    partnerId: string,
    newPartnerName: string,
    productId: string,
  ) {
    if (partnerId) {
      await this.prismaService.partnerProduct.create({
        data: {
          partner: { connect: { id: partnerId } },
          product: { connect: { id: productId } },
        },
      });
    } else if (newPartnerName) {
      const newPartner = await this.prismaService.partner.create({
        data: {
          name: newPartnerName,
        },
      });
      await this.prismaService.partnerProduct.create({
        data: {
          partner: { connect: { id: newPartner.id } },
          product: { connect: { id: productId } },
        },
      });
    }
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
