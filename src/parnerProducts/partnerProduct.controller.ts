import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PartnerProductsServices } from './parnerProduct.services';
import { CreatePartnerProductDto, UpdatePartnerProductDto } from './dto';

import { PaginationDto } from 'src/pagination/dto';

@Controller('parner-products')
export class PartnerProductsController {
  constructor(private readonly service: PartnerProductsServices) {}

  @Post()
  async create(@Body() dto: CreatePartnerProductDto) {
    return this.service.createPartnerProduct(dto);
  }
  @Get()
  async getPartnerProducts(@Query() paginationDto: PaginationDto) {
    return this.service.getAllPartnerProducts(paginationDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdatePartnerProductDto) {
    return this.service.updatePartnerProduct(id, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.service.deletePartnerProduct(id);
  }
}
