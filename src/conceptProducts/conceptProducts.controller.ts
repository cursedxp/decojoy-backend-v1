import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { AddProductToConceptDto } from './dto';
import { ConceptProductsService } from './conceptProducts.service';
import { CreateAndAddProductToConceptDto } from './dto/createAndAddProduct.dto';
import { ConceptProduct } from '@prisma/client';

import { PaginationDto } from 'src/pagination/dto';
import { PaginationService } from 'src/pagination/pagination.service';

@Controller('conceptProducts')
export class ConceptProductsController {
  constructor(
    private conceptProductService: ConceptProductsService,
    private paginationService: PaginationService,
  ) {}

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
  @Get()
  async getConceptProducts(@Query() paginationDto: PaginationDto) {
    return this.conceptProductService.getAllConceptProducts(paginationDto);
  }
}
