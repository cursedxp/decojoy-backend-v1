import { Controller, Post, Body, Param, Query, Get } from '@nestjs/common';
import { CreatePartnerDto } from './dto';
import { PartnerService } from './partner.services';

import { PaginationDto } from 'src/pagination/dto';
import { PaginationService } from 'src/pagination/pagination.service';

@Controller('partner')
export class PartnerController {
  constructor(
    private partnerService: PartnerService,
    private paginationService: PaginationService,
  ) {}

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
