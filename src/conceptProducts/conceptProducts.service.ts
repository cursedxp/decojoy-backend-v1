import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddProductToConceptDto } from './dto';
import { CreateAndAddProductToConceptDto } from './dto/createAndAddProduct.dto';
@Injectable()
export class ConceptProductsService {
  constructor(private readonly prismaService: PrismaService) {}

  async createProductAndAddToConcept(data: CreateAndAddProductToConceptDto) {
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
  }

  async removeProductFromConcept(data: AddProductToConceptDto) {
    return this.prismaService.conceptProduct.delete({
      where: {
        conceptId_productId: {
          conceptId: data.conceptId,
          productId: data.productId,
        },
      },
    });
  }

  async addProductToConcept(data: AddProductToConceptDto) {
    try {
      this.prismaService.conceptProduct.create({
        data: {
          concept: { connect: { id: data.conceptId } },
          product: { connect: { id: data.productId } },
        },
      });
    } catch (error) {}
  }
}
