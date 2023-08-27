import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { PartnerProductsServices } from './parnerProduct.services';
import { CreatePartnerProductDto, UpdatePartnerProductDto } from './dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('parner-products')
export class PartnerProductsController {
  constructor(private readonly service: PartnerProductsServices) {}

  @UseGuards(AuthGuard)
  @Roles('ADMIN')
  @Post()
  async create(@Body() dto: CreatePartnerProductDto) {
    return this.service.createPartnerProduct(dto);
  }

  @Get()
  async getAll() {
    return this.service.getAllPartnerProducts();
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
