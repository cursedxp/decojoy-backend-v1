import { Controller, Post, Body } from '@nestjs/common';
import { AddProductToConceptDto } from './dto';
import { ConceptProductsService } from './conceptProducts.service';
import { CreateAndAddProductToConceptDto } from './dto/createAndAddProduct.dto';
import { ConceptProduct } from '@prisma/client';
@Controller('conceptProducts')
export class ConceptProductsController {
  constructor(private conceptProductService: ConceptProductsService) {}
  @Post('add-product-to-concept')
  async addProductToConcept(
    @Body() dto: AddProductToConceptDto,
  ): Promise<ConceptProduct> {
    return this.conceptProductService.addProductToConcept(dto);
  }
  @Post('create-and-add-product')
  async createAndAddProduct(@Body() dto: CreateAndAddProductToConceptDto) {
    return this.conceptProductService.createProductAndAddToConcept(dto);
  }
}
