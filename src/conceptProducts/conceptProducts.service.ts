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
@Injectable()
export class ConceptProductsService {
  constructor(private readonly prismaService: PrismaService) {}

  async createProductAndAddToConcept(data: CreateAndAddProductToConceptDto) {
    try {
      const createdProduct = await this.prismaService.product.create({
        data: {
          title: data.title,
          image: data.image,
          description: data.description,
          category: data.category,
          price: data.price,
          url: data.url,
        },
      });

      return this.prismaService.conceptProduct.create({
        data: {
          concept: { connect: { id: data.conceptId } },
          product: { connect: { id: createdProduct.id } },
        },
      });
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

  async addProductToConcept(data: AddProductToConceptDto) {
    try {
      const conceptProduct = this.prismaService.conceptProduct.create({
        data: {
          concept: { connect: { id: data.conceptId } },
          product: { connect: { id: data.productId } },
        },
      });

      // If a partnerId is provided, associate the product with the partner.
      if (data.partnerId) {
        await this.prismaService.partnerProduct.create({
          data: {
            partner: { connect: { id: data.partnerId } },
            product: { connect: { id: data.productId } },
          },
        });
      }
      // If a newPartnerName is provided, create a new partner and associate the product with it.
      else if (data.newPartnerName) {
        const newPartner = await this.prismaService.partner.create({
          data: {
            name: data.newPartnerName,
          },
        });
        await this.prismaService.partnerProduct.create({
          data: {
            partner: { connect: { id: newPartner.id } },
            product: { connect: { id: data.productId } },
          },
        });
      }

      return conceptProduct;
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async getAllConceptProducts() {
    return await this.prismaService.conceptProduct.findMany();
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
