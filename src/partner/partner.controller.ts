import { Controller, Post, Body, Param, UseGuards } from '@nestjs/common';
import { CreatePartnerDto } from './dto';
import { PartnerService } from './partner.services';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('partner')
export class PartnerController {
  constructor(private partnerService: PartnerService) {}
  @Post('create-partner')
  @UseGuards(AuthGuard)
  @Roles('ADMIN')
  async createPartner(@Body() data: CreatePartnerDto) {
    return this.partnerService.createPartner(data);
  }
  @Post(':partnerId')
  @UseGuards(AuthGuard)
  @Roles('ADMIN')
  async deletePartner(@Param() partnerId: string) {
    return this.partnerService.deletePartner(partnerId);
  }
}
