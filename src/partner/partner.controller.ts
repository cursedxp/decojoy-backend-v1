import {
  Controller,
  Post,
  Body,
  Param,
  UseGuards,
  Query,
  Get,
} from '@nestjs/common';
import { CreatePartnerDto } from './dto';
import { PartnerService } from './partner.services';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { PaginationDto } from 'src/pagination/dto';
import { PaginationService } from 'src/pagination/pagination.service';

@Controller('partner')
export class PartnerController {
  constructor(
    private partnerService: PartnerService,
    private paginationService: PaginationService,
  ) {}

  @UseGuards(AuthGuard)
  @Roles('ADMIN')
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
