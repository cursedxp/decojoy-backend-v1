import {
  Controller,
  Post,
  Body,
  Param,
  Query,
  Get,
  UseGuards,
} from '@nestjs/common';
import { CreatePartnerDto } from './dto';
import { PartnerService } from './partner.services';

import { PaginationDto } from 'src/pagination/dto';

@Controller('partner')
export class PartnerController {
  constructor(private partnerService: PartnerService) {}

  @Post('create-partner')
  async createPartner(@Body() data: CreatePartnerDto) {
    return this.partnerService.createPartner(data);
  }
  @Post(':partnerId')
  async deletePartner(@Param() partnerId: string) {
    return this.partnerService.deletePartner(partnerId);
  }
  @Get()
  async getPartners(@Query() paginationDto: PaginationDto) {
    return this.partnerService.getAllPartners(paginationDto);
  }
}
