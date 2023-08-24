import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreatePartnerDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PartnerService {
  constructor(private readonly prismaService: PrismaService) {}
  async createPartner(data: CreatePartnerDto) {
    try {
      const partner = await this.prismaService.partner.findFirst({
        where: { name: data.name },
      });

      if (!partner) {
        throw new NotFoundException(`Partner is not Found`);
      }

      return this.prismaService.partner.create({ data: { ...data } });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }
  async deletePartner(partnerId: string) {
    try {
      const partner = await this.prismaService.partner.findUnique({
        where: { id: partnerId },
      });
      if (!partner) {
        throw new NotFoundException(`Partner is not Found`);
      }
      return await this.prismaService.partner.delete({
        where: { id: partnerId },
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async getAllConceptProducts() {
    return await this.prismaService.partner.findMany();
  }

  private handlePrismaError(error: any) {
    switch (error.code) {
      case 'P2002':
        throw new ConflictException('Unique constraint violation.');
      case 'P2016':
        throw new NotFoundException('Record not found.');
      case 'P2003':
        throw new BadRequestException('Foreign key constraint failed.');
      case 'P2001':
      default:
        throw new InternalServerErrorException(
          'An internal server error occurred.',
        );
    }
  }
}
