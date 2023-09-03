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
import { JwtStrategy } from 'src/auth/auth0.strategy';
import { PaginationDto } from 'src/pagination/dto';
import { Roles } from 'src/auth/roles.decorator';
@Controller('parner-products')
export class PartnerProductsController {
  constructor(private readonly service: PartnerProductsServices) {}
  @UseGuards(JwtStrategy)
  @Roles('ADMIN')
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
